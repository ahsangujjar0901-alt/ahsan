const products = [
 {id:1,brand:"CASIO",name:"G-Shock GM-2110D",category:["men","sport"],price:58999,image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=85",desc:"Metal-covered analog-digital design."},
 {id:2,brand:"SEIKO",name:"Presage Automatic",category:["men","luxury"],price:84999,image:"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=85",desc:"Classic automatic styling for formal days."},
 {id:3,brand:"CITIZEN",name:"Eco-Drive Classic",category:["men","luxury"],price:72999,image:"https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=800&q=85",desc:"Clean dial with dependable solar movement."},
 {id:4,brand:"SEIKO",name:"5 Sports Field",category:["men","sport"],price:69999,image:"https://images.unsplash.com/photo-1594534475808-b18fc33b045e?auto=format&fit=crop&w=800&q=85",desc:"Sporty automatic watch built for daily wear."},
 {id:5,brand:"CASIO",name:"Vintage A168",category:["men","women"],price:17999,image:"https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=85",desc:"Retro digital look with a timeless finish."},
 {id:6,brand:"CITIZEN",name:"Tsuyosa Automatic",category:["men","women","luxury"],price:89999,image:"https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=800&q=85",desc:"Integrated-bracelet style with a bold dial."},
 {id:7,brand:"SEIKO",name:"Ladies Quartz",category:["women"],price:52999,image:"https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&w=800&q=85",desc:"Elegant proportions for everyday elegance."},
 {id:8,brand:"CASIO",name:"G-Shock Sport",category:["sport","men"],price:45999,image:"https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=85",desc:"Durable sports styling for active days."}
];

let cart = JSON.parse(localStorage.getItem("timevaultCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("timevaultWishlist") || "[]");
let activeFilter = "all";

const money = n => "Rs. " + n.toLocaleString("en-PK");

function save(){
  localStorage.setItem("timevaultCart", JSON.stringify(cart));
  localStorage.setItem("timevaultWishlist", JSON.stringify(wishlist));
}

function renderProducts(){
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  const list = products.filter(p => (activeFilter==="all" || p.category.includes(activeFilter)) &&
    (p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)));
  const box = document.getElementById("products");
  document.getElementById("emptyState").hidden = list.length > 0;
  box.innerHTML = list.map(p => `
    <article class="product-card">
      <button class="wish ${wishlist.includes(p.id)?"active":""}" onclick="toggleWish(${p.id})">${wishlist.includes(p.id)?"♥":"♡"}</button>
      <div class="product-img"><img src="${p.image}" alt="${p.brand} ${p.name}" loading="lazy"></div>
      <div class="product-info">
        <span class="brand">${p.brand}</span>
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="price-row"><span class="price">${money(p.price)}</span><button class="add" onclick="addToCart(${p.id})">Add to cart</button></div>
      </div>
    </article>`).join("");
}

function addToCart(id){
  const found = cart.find(x=>x.id===id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  save(); renderCart(); showToast("Watch added to cart");
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);
  if(!item)return;
  item.qty += delta;
  if(item.qty<=0) cart=cart.filter(x=>x.id!==id);
  save(); renderCart();
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);save();renderCart()}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById("cartCount").textContent=count;
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML='<p class="empty">Your cart is empty.</p>';document.getElementById("cartTotal").textContent=money(0);return}
  let total=0;
  box.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id); total+=p.price*item.qty;
    return `<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${item.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div><button class="remove" onclick="removeItem(${p.id})">Remove</button></div>`
  }).join("");
  document.getElementById("cartTotal").textContent=money(total);
}
function toggleWish(id){
  wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);
  save();renderProducts();showToast(wishlist.includes(id)?"Added to wishlist":"Removed from wishlist");
}
function showToast(msg){
  const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");
  clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2200);
}
function openCart(){document.getElementById("cartPanel").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("overlay").classList.remove("show")}

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  activeFilter=btn.dataset.filter;renderProducts();
}));
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
document.getElementById("clearCart").onclick=()=>{cart=[];save();renderCart();showToast("Cart cleared")};
document.getElementById("themeBtn").onclick=()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("timevaultTheme",document.body.classList.contains("dark")?"dark":"light");
  document.getElementById("themeBtn").textContent=document.body.classList.contains("dark")?"☀":"☾";
};
if(localStorage.getItem("timevaultTheme")==="dark"){document.body.classList.add("dark");document.getElementById("themeBtn").textContent="☀"}

document.getElementById("menuBtn").onclick=()=>document.querySelector(".header").classList.toggle("nav-open");
document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>document.querySelector(".header").classList.remove("nav-open"));

document.getElementById("checkoutBtn").onclick=()=>{
  if(!cart.length){showToast("Your cart is empty");return}
  let total=0;
  document.getElementById("checkoutSummary").innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);total+=p.price*i.qty;return `${p.name} × ${i.qty}`}).join("<br>")+`<hr><strong>Total: ${money(total)}</strong>`;
  document.getElementById("checkoutModal").classList.add("show");closeCart();
};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).classList.remove("show"));

document.getElementById("checkoutForm").onsubmit=e=>{
  e.preventDefault();cart=[];save();renderCart();document.getElementById("checkoutModal").classList.remove("show");
  e.target.reset();showToast("Demo order placed successfully!");
};
document.getElementById("newsletterForm").onsubmit=e=>{e.preventDefault();e.target.reset();showToast("Thanks for joining TIMEVAULT!")};
document.getElementById("contactForm").onsubmit=e=>{e.preventDefault();e.target.reset();showToast("Message sent successfully!")};
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
