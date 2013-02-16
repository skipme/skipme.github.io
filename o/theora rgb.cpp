void* cbToken;
void* crTokeny;

/*

Utility functions for Theora video decoder, convert chroma samples to rgb bitscale.
the asm code add ~2fps

the  fc_rgb_BufferTEX might be used with video texture update as follow:
		glTexSubImage2D(GL_TEXTURE_2D, 
		0, 0, 0, fc_width, fc_height,
		GL_BGR_EXT, GL_UNSIGNED_BYTE, fc_rgb_BufferTEX);


(ti - theora_info)

**	fc_width=ti.width;
	fc_height=ti.height;
	fc_width2=fc_width/2;
	fc_height2=fc_width/2;

**	fc_fullSize = fc_width*fc_height*3;
	fc_halfSize = fc_width2*fc_height2;
	fc_rgb_Buffer=malloc(fc_fullSize) ;
	fc_rgb_BufferTEX=malloc(fc_fullSize) ;
*/

static void fc_getRGBbuffer(fc_yuv_buffer_s* chroma )
{
	//strech planes
	int i,j,cheUP1,uvindex,index;

	cheUP1=fc_width * 3;
	uvindex = 0; 
	cbToken =chroma->Cb_m;
	crTokeny=chroma->Cr_m;

	for ( i = 0; i < fc_height; i += 2)//lines
	{
		for ( j = 0; j < fc_width; j += 2)//rows
		{
			/////////////////////////
			//4:2:0->RGB
			/////////////////////////
			__asm {
				//index = i * fc_width;          
				//index += j;
				//index *= 3; 
				mov eax,i;
				mov edx,fc_width;
				mul edx;
				add eax,j;
				mov edx,3;
				mul edx;
				mov edx,eax;
				//edx=chroma->Cb_m[uvindex];
				mov eax, cbToken;
				add eax, uvindex;
				mov al, [eax];
				//fc_rgb_Buffer[index] = chroma->Cb_m[uvindex];
				mov ecx,fc_rgb_Buffer;
				add ecx,edx;//edx рассчитан выше
				mov esi,ecx;//сохраняем для cr обработки
				add ecx,1;//index offset [green]
				mov [ecx],al;
				//fc_rgb_Buffer[index + 3] = chroma->Cb_m[uvindex];
				add ecx,3;
				mov [ecx],al;
				//fc_rgb_Buffer[index + cheUP1 + 3] = chroma->Cb_m[uvindex];
				add ecx,cheUP1;
				mov [ecx],al;
				//fc_rgb_Buffer[index + cheUP1] = chroma->Cb_m[uvindex];
				sub ecx,3;
				mov [ecx],al;

				//edx=chroma->Cr_m[uvindex];
				mov eax, crTokeny;
				add eax, uvindex;
				mov al, [eax];
				//fc_rgb_Buffer[index] = chroma->Cr_m[uvindex];		
				mov ecx,esi;
				add ecx,2;//index offset[blue]
				mov [ecx],al;
				// fc_rgb_Buffer[index + 3] = chroma->Cr_m[uvindex];
				add ecx,3;
				mov [ecx],al;
				//fc_rgb_Buffer[index + cheUP1 + 3] = chroma->Cr_m[uvindex];
				add ecx,cheUP1;
				mov [ecx],al;
				//fc_rgb_Buffer[index + cheUP1] = chroma->Cr_m[uvindex];
				sub ecx,3;
				mov [ecx],al;
				//uvindex++;
				add uvindex, 1;
			}
		}
	}

	// convert colorspace
	frameLocked=1;
	int y, cb, cr, r_add, g_add, b_add;
	for ( i = 0; i < fc_fullSize; i += 3)
	{		   //normalize1(chroma->y_m[i/3], fc_rgb_Buffer[i+1], fc_rgb_Buffer[i+2],
		//&fc_rgb_BufferTEX[i], &fc_rgb_BufferTEX[i+1], &fc_rgb_BufferTEX[i+2]);
#   define SCALEBITS 10
#   define ONE_HALF  (1 << (SCALEBITS - 1))
#   define FIX(x)    ((int) ((x) * (1<<SCALEBITS) + 0.5))
#   define CLAMP( x ) (((x) > 255) ? 255 : ((x) < 0) ? 0 : (x));



		cb = fc_rgb_Buffer[i+2] - 128;
		cr = fc_rgb_Buffer[i+1] - 128;
		r_add = FIX(1.40200*255.0/224.0) * cr + ONE_HALF;
		g_add = - FIX(0.344136*255.0/224.0) * cb
			- FIX(0.71414*255.0/224.0) * cr + ONE_HALF;
		b_add = FIX(1.77200*255.0/224.0) * cb + ONE_HALF;
		y = (chroma->y_m[i/3] - 16) * FIX(255.0/219.0);
		fc_rgb_BufferTEX[i] = CLAMP((y + r_add) >> SCALEBITS);
		fc_rgb_BufferTEX[i+1] = CLAMP((y + g_add) >> SCALEBITS);
		fc_rgb_BufferTEX[i+2] = CLAMP((y + b_add) >> SCALEBITS);
	}
}

// alternative colorspace conversion
static inline void normalize1(unsigned char yo, unsigned char uo, unsigned char vo,
							  unsigned char* yot, unsigned char* uot, unsigned char* vot)
{

#   define SCALEBITS 10
#   define ONE_HALF  (1 << (SCALEBITS - 1))
#   define FIX(x)    ((int) ((x) * (1<<SCALEBITS) + 0.5))
#   define CLAMP( x ) (((x) > 255) ? 255 : ((x) < 0) ? 0 : (x));

	int y, cb, cr, r_add, g_add, b_add;

	cb = uo - 128;
	cr = vo - 128;
	r_add = FIX(1.40200*255.0/224.0) * cr + ONE_HALF;
	g_add = - FIX(0.344136*255.0/224.0) * cb
		- FIX(0.71414*255.0/224.0) * cr + ONE_HALF;
	b_add = FIX(1.77200*255.0/224.0) * cb + ONE_HALF;
	y = (yo - 16) * FIX(255.0/219.0);
	*vot = CLAMP((y + r_add) >> SCALEBITS);
	*uot = CLAMP((y + g_add) >> SCALEBITS);
	*yot = CLAMP((y + b_add) >> SCALEBITS);
	//offset correction*/
	/*float y,pr,pb,rr,gg,bb;

	y = ((float)yo - 16) / 219;
	pr = ((float)uo - 128) / 224;
	pb = ((float)vo - 128) / 224;

	rr = 1.402 * pr + y;
	gg = (-0.344136 * pb) + (0.714136 * pr) + y;
	bb = 1.772 * pb + y;

	if (rr > 1) rr = 1;
	else if (rr < 0) rr =0;

	if (gg > 1) gg = 1;
	else if (gg < 0) gg = 0;

	if (bb > 1) bb = 1;
	else if (bb < 0) bb = 0;

	// rr = rr * 255;
	// gg = gg * 255;
	//bb = bb * 255;

	*yot =rr* 255; 
	*uot = gg* 255;
	*vot = bb* 255;*/


}