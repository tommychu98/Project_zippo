import fs from 'node:fs/promises';
const lists=JSON.parse(await fs.readFile('docs/catalog-source/lists.json'));for(let page=2;page<=5;page++){const html=await(await fetch(`https://zippo.co.kr/goods/goods_list.php?cateCd=001009&page=${page}`)).text();await fs.writeFile(`docs/catalog-source/print-${page}.html`,html);lists.print.push(...[...html.matchAll(/<div class="item_cont">([\s\S]*?)<!-- \/\/item_cont -->/g)].map(m=>({id:m[1].match(/goodsNo=(\d+)/)?.[1],name:m[1].match(/class="item_name">([^<]+)/)?.[1],price:Number(m[1].match(/class="item_price">\s*<span[^>]*>([\d,]+)/)?.[1].replaceAll(',','')),image:m[1].match(/<img\s+src="([^"]+)/)?.[1]})));}
await fs.writeFile('docs/catalog-source/lists.json',JSON.stringify(lists,null,2));
const global=JSON.parse(await fs.readFile('docs/catalog-source/global-540.json')).products;
console.log(lists.print.filter(p=> /540/.test(p.name)));
console.log(global.map(g=>({title:g.title,sku:g.variants[0].sku,matched:lists.print.filter(p=>p.name.includes(g.variants[0].sku.slice(0,5))||p.name.toLowerCase().endsWith(g.title.toLowerCase()))})).filter(x=>x.matched.length));
