export type Product = { id:string; name:string; store:string; category:string; price:number; emoji:string; description:string; available:boolean; featured?:boolean };

export const products: Product[] = [
  {id:'1',name:'Ayam Geprek',store:'Warung Bu Sari',category:'Makanan',price:20000,emoji:'🍗',description:'Ayam crispy dengan sambal pilihan.',available:true,featured:true},
  {id:'2',name:'Bakso Special',store:'Bakso Pak Kumis',category:'Makanan',price:25000,emoji:'🍲',description:'Bakso gurih dengan kuah hangat.',available:true,featured:true},
  {id:'3',name:'Mie Ayam',store:'Kedai N for Eat',category:'Makanan',price:18000,emoji:'🍜',description:'Mie ayam klasik dengan topping melimpah.',available:true},
  {id:'4',name:'Seblak',store:'Warung Bu Sari',category:'Makanan',price:20000,emoji:'🌶️',description:'Seblak pedas gurih dengan topping favorit.',available:true},
  {id:'5',name:'Nasi Goreng',store:'Kedai N for Eat',category:'Makanan',price:22000,emoji:'🍚',description:'Nasi goreng wangi dan nikmat.',available:true},
  {id:'6',name:'Martabak Manis',store:'Martabak Favorit',category:'Dessert',price:35000,emoji:'🥞',description:'Martabak manis dengan topping pilihan.',available:true,featured:true},
  {id:'7',name:'Pisang Keju',store:'Martabak Favorit',category:'Snack',price:18000,emoji:'🍌',description:'Pisang crispy dengan keju dan susu.',available:true},
  {id:'8',name:'Dessert Box',store:'Kedai N for Eat',category:'Dessert',price:25000,emoji:'🍰',description:'Dessert lembut untuk teman santai.',available:true},
  {id:'9',name:'Es Kopi',store:'Kedai N for Eat',category:'Minuman',price:15000,emoji:'☕',description:'Kopi susu dingin yang creamy.',available:true},
  {id:'10',name:'Thai Tea',store:'Kedai N for Eat',category:'Minuman',price:12000,emoji:'🧋',description:'Thai tea manis dan segar.',available:true}
];

export const rupiah = (n:number) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
