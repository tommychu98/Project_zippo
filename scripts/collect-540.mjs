import fs from 'node:fs/promises';
const l=JSON.parse(await fs.readFile('docs/catalog-source/lists.json'));const ids=['1000001892','1000001893','1000001891','1000001890','1000001889','1000001888','1000001887','1000001770'];
const all=JSON.parse(await fs.readFile('docs/catalog-source/selected.json'));all['540-color']=[];
for(const id of ids){const p=l.print.find(p=>p.id===id);p.sourceUrl=`https://zippo.co.kr/goods/goods_view.php?goodsNo=${id}`;const h=await(await fetch(p.sourceUrl)).text();await fs.writeFile(`docs/catalog-source/${id}.html`,h);p.category='540-color';p.imageUrls=[...new Set(h.match(/https?:[^\s"<>\\]+\/image\/detail\/[^\s"<>\\]+\.(?:jpg|png)/g)||[])].filter(u=>!u.includes('/thumb/'));console.log(p.name,p.price,p.imageUrls.length,h.match(/<img src="[^"]+(?:detail\/zp|detail\/zippo)[^"]+/g));all['540-color'].push(p);}
for(const ps of Object.values(all))for(const p of ps)p.imageUrls=p.imageUrls.filter(u=>!u.includes('/thumb/'));
await fs.writeFile('docs/catalog-source/selected.json',JSON.stringify(all,null,2));
