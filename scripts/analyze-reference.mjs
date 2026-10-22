import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const detailed = process.argv.includes('--detail');
const out=detailed ? 'docs/reference-video/detail' : 'docs/reference-video'; await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch(); const page=await browser.newPage();
const video=await fs.readFile('C:/Users/mbc/Downloads/5efb2fac6d9c2838142551.mp4');
await page.setContent('<video id="v" muted></video>');
await page.evaluate(async b=>{const v=document.querySelector('video');v.src='data:video/mp4;base64,'+b;await new Promise((r,j)=>{v.onloadedmetadata=r;v.onerror=j;});},video.toString('base64'));
const meta=await page.evaluate(()=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight})); console.log(meta);
const composites=[]; let i=0;
const times = detailed ? Array.from({length: 24}, (_, i) => 4.75 + i * .25) : Array.from({length: Math.ceil(meta.duration / 2)}, (_, i) => i * 2);
for(const t of times){const data=await page.evaluate(async t=>{v.currentTime=t;await new Promise(r=>{v.onseeked=r;});const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return c.toDataURL('image/png').split(',')[1];},t||0.01);const buf=Buffer.from(data,'base64');await fs.writeFile(`${out}/${String(t).padStart(3,'0')}.png`,buf); const thumb=await sharp(buf).resize(320,240,{fit:'contain',background:'#eee'}).png().toBuffer();composites.push({input:thumb,left:(i%4)*320,top:Math.floor(i/4)*268});composites.push({input:Buffer.from(`<svg width="320" height="28"><rect width="320" height="28" fill="white"/><text x="10" y="20" font-size="16">${t}s</text></svg>`),left:(i%4)*320,top:Math.floor(i/4)*268+240});i++;}
await sharp({create:{width:1280,height:Math.ceil(i/4)*268,channels:3,background:'#fff'}}).composite(composites).png().toFile(`${out}/contact-sheet.png`); await fs.writeFile(`${out}/metadata.json`,JSON.stringify(meta));await browser.close();
