//console.log("deneme")

/*
KATEGORİLERİ SİTEDE LİSTELEME ADIMLARI 
- API YE İSTEK AT 
-İSTEKTEN DÖNEN VERİLERİ İŞLE 


SEPETİ AÇMAK KAPAMAK İÇİN GEREKLİ OLAN ELEMANLAR

-AÇMA BUTONU 
-KAPAMA BUTONU
-SEPET MODALI 


*/

const categoryList = document.getElementById("category-list");
//console.log(categoryList);

const productsList = document.getElementById("products");
//console.log(productsList)

const closeButton = document.getElementById("close-button");
//console.log(closeButton)

const openButton = document.getElementById("open-button");
//console.log(openButton)

const modal = document.getElementById("modal");
//console.log(modal)

const modalList = document.querySelector(".modal-list");
//console.log(modalList)

const totalPrice = document.getElementById("total-price");
//console.log(totalPrice)

//?   API'ye kategori listesi için istek attığımız ve uygulamada kategori bastırmak için fonksiyon
function fetchCategories() {
  //console.log("fonks çalışıyor")

  //? API isteklerinde verinin gelme süreci:
  //? İsteklerin iki sonucu vardır:
  //? Olumlu olma durumu ( then metoduyla da ele alınır)
  //? Olumsuz hata döndürme sonucu (error metodu ile ele alınır)
  //? Her iki durum da anlık gerçekleşmez belli bir süreç geçer
  //? Bunun için async/await yapısı ile veya than/catch ya da try catch gibi fonksiyon blokları ile bu istekler yapılır

  //? API'ye veri çekme isteği atma
  fetch("https://fakestoreapi.com/products")
    //? Eğer apiden olumlu yanıt gelmişse then bloğu çalışacak

    //?Apiden gelen ilk cevabı JSON verisine çeviriyoruz
    .then((Response) => Response.json())

    //? JSON çevirme işlemi de süreç gerektirir ve bunun için de bir then bloğu daha kullanılır
    .then((data) =>
      //? Gelen data verisi çok fazla olduğu için slice metodu ile diziyi böldük
      //? ve bölünmüş olan yeni diziye map metodu uygulayarak her bir eleman için işlem gerçekleştirdik
      data.slice(0, 5).map((categoryy) => {
        //?  -------------  OBJECT DESTRUCTOR -------------

        //? Verileri kullanılacak objeden bir kere en başta çıkarıp
        //? Daha sonra ilgili yerlerde sadece key yazarak erişmek için yapılır

        const { category, image } = categoryy;

        //console.log(name)
        //console.log(image)

        //? MAP metodu diziyi dönerken döndüğü her bir eleman için bir div oluşturuyor
        const categoryDiv = document.createElement("div");

        //? Oluşturulan bu dive istenilen class ekleniyor
        categoryDiv.classList.add("category");

        //? Oluşturulmuş olan divin içeriği innerHTML ile düzenleniyor
        categoryDiv.innerHTML = `
<img src=${image} alt="" />
<span>${category}</span>
`;

        //console.log(categoryDiv);

        //? Daha sonra JS tarafında oluşturulan bu elemanın HTML tarafında da gözükmesi için appendChild metodu ile html'e gönderiliyor
        categoryList.appendChild(categoryDiv);
      })
    )

    //? Eğer apiden olumsuz sonuç gelirse burdaki blog çalışır
    .catch((Error) => console.log(Error));
}

fetchCategories();

function fetchproducts() {
  fetch("https://fakestoreapi.com/products")
    .then((Response) => Response.json())
    .then((data) =>
      data.map((product) => {
        //console.log(product);

        const { title, price, category, image, id } = product;

        //? div oluştur
        const productDiv = document.createElement("div");
        //console.log(productDiv)
        productDiv.classList.add("product");

        productDiv.innerHTML = `
        <img src=${image} alt="">
        <p>${title}</p>
        <p>${category}</p>
        <div class="product-action">
            <p>${price} TL</p>
            <button onclick="addToBasket({id:${id}, title:'${title}', price:${price}, image:'${image}', amount:1 })">Sepete Ekle</button>
            </div>

        `;

        productsList.appendChild(productDiv);
      })
    )
    .catch((Error) => console.log("api hatası", Error));
}

fetchproducts();

let basket = [];

let total = 0;

//? --------- SEPETE EKLEME İŞLEMLERİ ---------

function addToBasket(product) {
  //console.log("sepete ekleme fonks");
  //console.log(product)

  //? Eğer benim sepetimde
  //? dışarıdan gelen product ile aynı id numarasına sahip eleman varsa
  //? o elemanın amount bilgisini arttır

  const idsiaynieleman = basket.find(
    (sepettekiEleman) => sepettekiEleman.id === product.id
  );
  //console.log(idsiaynieleman);

  if (idsiaynieleman) {
    idsiaynieleman.amount++;
  } else {
    basket.push(product);
  }

 //console.log(basket);
}

//? Sepet açıldığında sepetteki ürünleri listeleme fonksiyonu
function showBasketItems() {
  // console.log('sepeti listeleme')

  basket.map((basketProduct) => {

//? Her bir sepet elemanı için div oluştur
    const listItem = document.createElement("div");

//? bu dive list-item classını ekle
    listItem.classList.add("list-item");

    //console.log(basketProduct);

    const { image, title, price, amount, id } = basketProduct;


//? Oluşturduğu listItem divi içine HTML olarak ekleme
    listItem.innerHTML = `
                    <img src=${image} alt=""/>
                    <h4>${title}</h4>
                    <h4 class="price">${price}</h4>
                    <p>Miktar: ${amount}</p>
                    <button class="delete-button" onclick='deleteItem({id:${id}, price:${price}, amount:${amount}})'>Sil</button>
  `;

//? Oluştururlan divi HTML tarafına gönderme
    modalList.appendChild(listItem);

    //console.log(listItem);

    total += price * amount;
  });
}

//? --------- SEPET AÇMA KAPAMA İŞLEMLERİ ---------

//? Sepet butonuna tıklanma olayını dinliyoruz
openButton.addEventListener("click", () => {
  //console.log('sepet butonuna tıklandı')



  showBasketItems();
  //? HTML de oluşturduğumuz modala active classını ekliyoruz
  modal.classList.add("active");

  totalPrice.innerText = total;
});

//? Çarpı resmine tıklanma anını yakalıyoruz
closeButton.addEventListener("click", () => {
  //? Modaldan actice classını kaldırıyoruz
  modal.classList.remove("active");
  modalList.innerHTML='';
  total=0;
});

//? Eğer çarpı değilde modalın dışına gri alana tıklanınca kapatmak için
//? modalın tıklanma olayını dinliyoruz
modal.addEventListener("click", (event) => {
  //? Tıklanma olayından dönen etkinliği analiz ediyoruz
  //console.log(event.target)

  //? Tıklanılan elemanın classları eğer modal-wrapper içeriyorsa (yani gri alana tıklandıysa)
  if (event.target.classList.contains("modal-wrapper")) {
    //? Modaldan actice classını kaldırıyoruz
    modal.classList.remove("active");
  }

  //modal.classList.remove('active')
});

//? --------- SİLME İŞLEMİ ---------

function deleteItem(willDeleteItem) {
  //console.log("silmeden önce", basket)

//? Filter metodu tüm diziyi gezer ve bize her dizi elemanını geri verir 
//? Daha sonra yapacağımız kıyasa göre o eleman olmadan bir dizi döner
//? Tüm sepeti dön ve eğer sepetteki elemanın idsi benim silinecek elemanın idsine eşit değilse 
//? bunu diziye koy ve bana yeni diziyi geri döndür
  basket = basket.filter((eleman) => eleman.id !== willDeleteItem.id);
  //console.log('sildikten sonra', basket)

//? Toplam fiyat bilgisi istenilen eleman silindikten sonra güncelleme
  total-=willDeleteItem.price*willDeleteItem.amount

//? Toplam fiyatı HTML e gönderme 
  totalPrice.innerText=total
}


//? Silinen elemanı HTML tarafında kaldırmak için 
modalList.addEventListener("click", (tiklamaOlayiBilgileri) => {

//? Hangi elemana tıklandığını tespit etme  
  console.log(tiklamaOlayiBilgileri.target);

//? Eğer benim tıkladığım elemanın classı delete-button içeriyorsa
  if (tiklamaOlayiBilgileri.target.classList.contains("delete-button")) {

//? tıkladığım elemanın bir üst kapsayıcı elemanını htmlden sil
    tiklamaOlayiBilgileri.target.parentElement.remove();
  }

//? Eğer benim sepetimde eleman yoksa modalı kapat 
  if(basket.length === 0){

//? modalın clasından active çıkar
    modal.classList.remove('active')
  }


});


