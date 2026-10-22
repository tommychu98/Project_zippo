import fs from 'node:fs/promises';
const l=JSON.parse(await fs.readFile('docs/catalog-source/lists.json'));const all=JSON.parse(await fs.readFile('docs/catalog-source/selected.json'));
const ids=['1000001892','1000001888','1000001890','1000001770','1000001464','1000001985','1000001993',l.print.find(p=>p.name.includes('47263')).id];all['540-color']=[];
for(const id of ids){const p=l.print.find(p=>p.id===id);p.sourceUrl=`https://zippo.co.kr/goods/goods_view.php?goodsNo=${id}`;let h;try{h=await fs.readFile(`docs/catalog-source/${id}.html`,'utf8');}catch{h=await(await fetch(p.sourceUrl)).text();await fs.writeFile(`docs/catalog-source/${id}.html`,h);}p.category='540-color';p.imageUrls=[...new Set(h.match(/https?:[^\s"<>\\]+\/image\/detail\/[^\s"<>\\]+\.(?:jpg|png)/g)||[])].filter(u=>!u.includes('/thumb/'));console.log(p.name,p.price,p.imageUrls.length,h.match(/SKU:[^<]+/)?.[0]);all['540-color'].push(p);}
await fs.writeFile('docs/catalog-source/selected.json',JSON.stringify(all,null,2));
