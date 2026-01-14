/* ----------------- Menu + Cart ----------------- */
const products=[
{name:"Tea",price:10},{name:"Ginger Tea",price:15},
{name:"Coffee",price:15},{name:"Filter Coffee",price:15},
{name:"Milk",price:10},{name:"Boost",price:15},
{name:"Horlicks",price:15},{name:"Biscuits",price:5}
];
let qty = new Array(products.length).fill(0);
let cart = JSON.parse(localStorage.getItem("cart"))||[];

/* Render menu */
function renderMenu(menuDiv){
products.forEach((p,i)=>{
menuDiv.innerHTML+=`
<div class="item">
<h3>${p.name}</h3>
<p>₹${p.price}</p>
<div class="qty">
<button onclick="changeQty(${i},-1)">−</button>
<span id="q${i}">0</span>
<button onclick="changeQty(${i},1)">+</button>
</div>

</div>`;
});
}

function changeQty(i,v){
  qty[i] = Math.min(999, Math.max(0, qty[i] + v));
  document.getElementById("q"+i).innerText = qty[i];

  let found = cart.find(c => c.name === products[i].name);

  if (qty[i] === 0) {
    if (found) {
      cart = cart.filter(c => c.name !== products[i].name);
    }
  } else {
    if (found) {
      found.qty = qty[i];
    } else {
      cart.push({
        name: products[i].name,
        price: products[i].price,
        qty: qty[i]
      });
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}


function addToCart(i,btn){
if(qty[i]==0){ alert("Quantity 0"); return; }
let found=cart.find(c=>c.name===products[i].name);
if(found){ found.qty+=qty[i]; }
else{ cart.push({name:products[i].name,price:products[i].price,qty:qty[i]}); }
localStorage.setItem("cart",JSON.stringify(cart));
qty[i]=0; document.getElementById("q"+i).innerText=0;

let fly=document.createElement("div"); fly.className="fly"; fly.innerText="🧺";
btn.parentElement.appendChild(fly);
setTimeout(()=>fly.remove(),700);
}

/* ----------------- Cart Page ----------------- */
function renderCart(cartDiv,totalDiv){
cartDiv.innerHTML=""; let total=0;
cart.forEach((i,idx)=>{
let amt=i.qty*i.price; total+=amt;
cartDiv.innerHTML+=`
<div class="row">
<span>${i.name}</span>
<span>
<button onclick="chg(${idx},-1)">−</button>
${i.qty}
<button onclick="chg(${idx},1)">+</button>
</span>
<span>₹${amt}</span>
<button onclick="del(${idx})">❌</button>
</div>`;
});
totalDiv.innerText="Total: ₹"+total;
localStorage.setItem("cart",JSON.stringify(cart));
}

function chg(i,v){ cart[i].qty+=v; if(cart[i].qty<=0) cart.splice(i,1); updateCart(); }
function del(i){ cart.splice(i,1); updateCart(); }
function updateCart(){ renderCart(document.getElementById("cart"),document.getElementById("total")); }

/* ----------------- Payment ----------------- */
function payRazor(){ // Razorpay placeholder
if(cart.length===0){ alert("Cart empty"); return; }
let total=cart.reduce((s,i)=>s+(i.price*i.qty),0);
let orders=JSON.parse(localStorage.getItem("orders"))||[];
orders.push({date:new Date().toLocaleString(),items:cart,total:total});
localStorage.setItem("orders",JSON.stringify(orders));
localStorage.removeItem("cart");
alert("Payment Successful ✅");
location.href="orders.html";
}

/* ----------------- WhatsApp Order ----------------- */
function whatsappOrder(){
let number = prompt("Enter your WhatsApp number (with country code)","");
if(!number) return;
let msg = "JP Coffee Shop Order:%0A";
cart.forEach(i=> msg+= `${i.name} x ${i.qty} ₹${i.price*i.qty}%0A`);
let total = cart.reduce((s,i)=>s+(i.price*i.qty),0);
msg += `Total: ₹${total}`;
window.open(`https://wa.me/${9940632160}?text=${hi}`,'_blank');
}

/* ----------------- Print Bill / Token ----------------- */
function printBill(){
let win = window.open("","Print","width=600,height=600");
win.document.write("<h2>JP Coffee Shop</h2>");
win.document.write("<h2>**************</h2>");
win.document.write("<p>Date: "+new Date().toLocaleString()+"</p>");
cart.forEach(i=>win.document.write(`<p>${i.name} x ${i.qty} = ₹${i.price*i.qty}</p>`));
let total = cart.reduce((s,i)=>s+(i.price*i.qty),0);
win.document.write(`<p><strong>Total: ₹${total}</strong></p>`);
win.document.write("<p>Thank you!</p>");
win.print();
}

/* ----------------- Admin Login ----------------- */
function adminLogin(pinInput){
let pin = "5798"; // Change PIN here
if(pinInput===pin){
localStorage.setItem("admin","true");
location.href="orders.html";
}else{ alert("Incorrect PIN"); }
}
function checkAdmin(){ return localStorage.getItem("admin")==="true"; }

function updateCartCount(){
  let count = cart.reduce((s,i)=>s + i.qty, 0);
  let el = document.getElementById("cartCount");
  if(!el) return;

  el.innerText = count;

  let icon = document.querySelector(".cart-icon");
  icon.classList.remove("cart-bounce");
  void icon.offsetWidth; // restart animation
  icon.classList.add("cart-bounce");
}

