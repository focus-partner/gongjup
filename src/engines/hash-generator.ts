/** 哈希生成器引擎 —— 使用 Web Crypto API */
export type HashAlgo = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" | "MD5";

export async function hashText(text: string, algo: HashAlgo): Promise<string> {
  if (algo === "MD5") return md5Fallback(text);
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,"0")).join("");
}

/** 简易 MD5 实现（crypto.subtle 不支持 MD5） */
function md5Fallback(text: string): string {
  // 使用简化实现，适用于非安全场景
  function rotateLeft(l:number,i:number){return l<<i|l>>>32-i}
  function addUnsigned(lX:number,lY:number){const lX8=(lX&0x80000000),lY8=(lY&0x80000000),lX4=(lX&0x40000000),lY4=(lY&0x40000000);const lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);return (lX4&lY4)^lResult?lResult^0x80000000^lX8^lY8:lResult^lX8^lY8}
  function md5F(x:number,y:number,z:number){return(x&y)|((~x)&z)}
  function md5G(x:number,y:number,z:number){return(x&z)|(y&(~z))}
  function md5H(x:number,y:number,z:number){return x^y^z}
  function md5I(x:number,y:number,z:number){return y^(x|(~z))}
  function md5FF(a:number,b:number,c:number,d:number,x:number,s:number,ac:number){a=addUnsigned(a,addUnsigned(addUnsigned(md5F(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b)}
  function md5GG(a:number,b:number,c:number,d:number,x:number,s:number,ac:number){a=addUnsigned(a,addUnsigned(addUnsigned(md5G(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b)}
  function md5HH(a:number,b:number,c:number,d:number,x:number,s:number,ac:number){a=addUnsigned(a,addUnsigned(addUnsigned(md5H(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b)}
  function md5II(a:number,b:number,c:number,d:number,x:number,s:number,ac:number){a=addUnsigned(a,addUnsigned(addUnsigned(md5I(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b)}
  function convertToWordArray(str:string): number[] {const lWordCount=(((str.length+8)>>6)+1)<<4;const lByteArray: number[] =new Array(lWordCount).fill(0);for(let i=0;i<str.length;i++)lByteArray[i>>2]|=(str.charCodeAt(i)&0xFF)<<((i%4)<<3);lByteArray[str.length>>2]|=0x80<<((str.length%4)<<3);lByteArray[lWordCount-2]=str.length<<3;lByteArray[lWordCount-1]=str.length>>>29;return lByteArray}
  function wordToHex(lValue:number){let wordToHexValue="";for(let i=0;i<=3;i++){const byte=(lValue>>>(i*8))&0xFF;wordToHexValue+=("0"+byte.toString(16)).slice(-2)}return wordToHexValue}
  const x=convertToWordArray(text);let a=0x67452301,b=0xEFCDAB89,c=0x98BADCFE,d=0x10325476;
  for(let k=0;k<x.length;k+=16){const AA=a,BB=b,CC=c,DD=d;a=md5FF(a,b,c,d,x[k+0],7,0xD76AA478);d=md5FF(d,a,b,c,x[k+1],12,0xE8C7B756);c=md5FF(c,d,a,b,x[k+2],17,0x242070DB);b=md5FF(b,c,d,a,x[k+3],22,0xC1BDCEEE);a=md5FF(a,b,c,d,x[k+4],7,0xF57C0FAF);d=md5FF(d,a,b,c,x[k+5],12,0x4787C62A);c=md5FF(c,d,a,b,x[k+6],17,0xA8304613);b=md5FF(b,c,d,a,x[k+7],22,0xFD469501);a=md5FF(a,b,c,d,x[k+8],7,0x698098D8);d=md5FF(d,a,b,c,x[k+9],12,0x8B44F7AF);c=md5FF(c,d,a,b,x[k+10],17,0xFFFF5BB1);b=md5FF(b,c,d,a,x[k+11],22,0x895CD7BE);a=md5FF(a,b,c,d,x[k+12],7,0x6B901122);d=md5FF(d,a,b,c,x[k+13],12,0xFD987193);c=md5FF(c,d,a,b,x[k+14],17,0xA679438E);b=md5FF(b,c,d,a,x[k+15],22,0x49B40821);a=md5GG(a,b,c,d,x[k+1],5,0xF61E2562);d=md5GG(d,a,b,c,x[k+6],9,0xC040B340);c=md5GG(c,d,a,b,x[k+11],14,0x265E5A51);b=md5GG(b,c,d,a,x[k+0],20,0xE9B6C7AA);a=md5GG(a,b,c,d,x[k+5],5,0xD62F105D);d=md5GG(d,a,b,c,x[k+10],9,0x2441453);c=md5GG(c,d,a,b,x[k+15],14,0xD8A1E681);b=md5GG(b,c,d,a,x[k+4],20,0xE7D3FBC8);a=md5GG(a,b,c,d,x[k+9],5,0x21E1CDE6);d=md5GG(d,a,b,c,x[k+14],9,0xC33707D6);c=md5GG(c,d,a,b,x[k+3],14,0xF4D50D87);b=md5GG(b,c,d,a,x[k+8],20,0x455A14ED);a=md5GG(a,b,c,d,x[k+13],5,0xA9E3E905);d=md5GG(d,a,b,c,x[k+2],9,0xFCEFA3F8);c=md5GG(c,d,a,b,x[k+7],14,0x676F02D9);b=md5GG(b,c,d,a,x[k+12],20,0x8D2A4C8A);a=md5HH(a,b,c,d,x[k+5],4,0xFFFA3942);d=md5HH(d,a,b,c,x[k+8],11,0x8771F681);c=md5HH(c,d,a,b,x[k+11],16,0x6D9D6122);b=md5HH(b,c,d,a,x[k+14],23,0xFDE5380C);a=md5HH(a,b,c,d,x[k+1],4,0xA4BEEA44);d=md5HH(d,a,b,c,x[k+4],11,0x4BDECFA9);c=md5HH(c,d,a,b,x[k+7],16,0xF6BB4B60);b=md5HH(b,c,d,a,x[k+10],23,0xBEBFBC70);a=md5HH(a,b,c,d,x[k+13],4,0x289B7EC6);d=md5HH(d,a,b,c,x[k+2],11,0xEAA127FA);c=md5HH(c,d,a,b,x[k+0],16,0xD4EF3085);b=md5HH(b,c,d,a,x[k+3],23,0x4881D05);a=md5HH(a,b,c,d,x[k+6],4,0xD9D4D039);d=md5HH(d,a,b,c,x[k+9],11,0xE6DB99E5);c=md5HH(c,d,a,b,x[k+12],16,0x1FA27CF8);b=md5HH(b,c,d,a,x[k+15],23,0xC4AC5665);a=md5II(a,b,c,d,x[k+0],6,0xF4292244);d=md5II(d,a,b,c,x[k+7],10,0x432AFF97);c=md5II(c,d,a,b,x[k+14],15,0xAB9423A7);b=md5II(b,c,d,a,x[k+5],21,0xFC93A039);a=md5II(a,b,c,d,x[k+12],6,0x655B59C3);d=md5II(d,a,b,c,x[k+3],10,0x8F0CCC92);c=md5II(c,d,a,b,x[k+10],15,0xFFEFF47D);b=md5II(b,c,d,a,x[k+1],21,0x85845DD1);a=md5II(a,b,c,d,x[k+8],6,0x6FA87E4F);d=md5II(d,a,b,c,x[k+15],10,0xFE2CE6E0);c=md5II(c,d,a,b,x[k+6],15,0xA3014314);b=md5II(b,c,d,a,x[k+13],21,0x4E0811A1);a=md5II(a,b,c,d,x[k+4],6,0xF7537E82);d=md5II(d,a,b,c,x[k+11],10,0xBD3AF235);c=md5II(c,d,a,b,x[k+2],15,0x2AD7D2BB);b=md5II(b,c,d,a,x[k+9],21,0xEB86D391);a=addUnsigned(a,AA);b=addUnsigned(b,BB);c=addUnsigned(c,CC);d=addUnsigned(d,DD)}
  return (wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d)).toLowerCase();
}
