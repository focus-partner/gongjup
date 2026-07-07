/** 图片编辑引擎 —— Canvas 操作 */

export function loadImage(file: File): Promise<{img:HTMLImageElement; width:number; height:number}> {
  return new Promise((resolve,reject)=>{
    const img=new Image();const url=URL.createObjectURL(file);
    img.onload=()=>{URL.revokeObjectURL(url);resolve({img,width:img.naturalWidth,height:img.naturalHeight})};
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("图片加载失败"))};
    img.src=url;
  });
}

export function cropImage(img: HTMLImageElement, x:number, y:number, w:number, h:number): HTMLCanvasElement {
  const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
  canvas.getContext("2d")!.drawImage(img,x,y,w,h,0,0,w,h);
  return canvas;
}

export function resizeImage(img: HTMLImageElement, maxW:number, maxH:number): HTMLCanvasElement {
  let w=img.naturalWidth,h=img.naturalHeight;
  if(w>maxW){h*=(maxW/w);w=maxW} if(h>maxH){w*=(maxH/h);h=maxH}
  const canvas=document.createElement("canvas");canvas.width=Math.round(w);canvas.height=Math.round(h);
  canvas.getContext("2d")!.drawImage(img,0,0,canvas.width,canvas.height);
  return canvas;
}

export function rotateImage(img: HTMLImageElement, degrees: 90|180|270): HTMLCanvasElement {
  const swap=degrees===90||degrees===270;
  const canvas=document.createElement("canvas");
  canvas.width=swap?img.naturalHeight:img.naturalWidth;
  canvas.height=swap?img.naturalWidth:img.naturalHeight;
  const ctx=canvas.getContext("2d")!;ctx.translate(canvas.width/2,canvas.height/2);
  ctx.rotate(degrees*Math.PI/180);ctx.drawImage(img,-img.naturalWidth/2,-img.naturalHeight/2);
  return canvas;
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const l=document.createElement("a");l.download=filename;l.href=canvas.toDataURL();l.click();
}
