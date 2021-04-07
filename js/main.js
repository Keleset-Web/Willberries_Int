const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const bannersLink = document.querySelectorAll('.banners-link')

const cartTableGoods = document.querySelector('.cart-table__goods');
const cartTableTotal = document.querySelector('.cart-table__total');
const cartClear = document.querySelector('.cart-clear');
const cartTotalCount = document.querySelector('.cart-count');

const getGoods = async function() {
	const result = await fetch('db/db.json');
	if(!result.ok){
		throw 'Ошибочка вышла: ' + result.status
	}
	return result.json();
}


const cart = {
	cartGoods: [
		
	],
	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({id, name, price, count}) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
			<td>${name}</td>
			<td>${price} руб.</td>
			<td><button class="cart-btn-minus">-</button></td>
			<td>${count}</td>
			<td><button class="cart-btn-plus">+</button></td>
			<td>${price * count} руб.</td>
			<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
		});
				
		const totalPrice = this.cartGoods.reduce((sum,item)=>{
			return sum + (item.price * item.count);
		}, 0); 
		
		cartTableTotal.textContent = totalPrice + 'руб.';
		this.cartCount();

	},
	deliteGood(id){
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		
		this.renderCart();
	},
	minusGood(id){
		for(const item of this.cartGoods){
			if(item.id === id){
				if(item.count <= 1){
					this.deliteGood(id);
				}else{
					item.count--;
				}
				break;
			}
		}
		
		this.renderCart();
	},
	plusGood(id){
		for(const item of this.cartGoods){
			if(item.id === id){
				item.count++;
				break;
			}
		}
		this.renderCart();
	},
	addCartGoods(id){
		const goodItem = this.cartGoods.find(item => item.id === id);
		if(goodItem){
			this.plusGood(id)
		}else{
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({id, name, price}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count:1
					});
					this.renderCart();
				});		
		}
		
	},
	cartClear(){
		this.cartGoods = [];
		this.renderCart();
	},
	cartCount(){
		console.log(this.cartGoods);
		let totalCount = 0;
		this.cartGoods.forEach(item => {
			totalCount = totalCount + item.count;
		});
			
		
		/*let totalCount = this.cartGoods.reduce((sumCount, item) => {
			return sumCount + item.count;
		}, 0);*/
		if(totalCount <= 0){
			totalCount = '';
		}
		
		console.log(totalCount);
		cartTotalCount.textContent = totalCount;
	}
}

cartClear.addEventListener('click', event =>{
	const target = event.target.closest('.cart-clear');
	if(target){
		cart.cartClear();
	}
});


document.body.addEventListener('click', event => {
	const target = event.target.closest('.add-to-cart');
	if(target){
		cart.addCartGoods(target.dataset.id);
	}
})
cartTableGoods.addEventListener('click', e =>{
	const target = e.target;
	if(target.classList.contains('cart-btn-delete')){
		const id = target.closest('.cart-item').dataset.id;
		cart.deliteGood(id);
	};
	if(target.classList.contains('cart-btn-plus')){
		const id = target.closest('.cart-item').dataset.id;
		cart.plusGood(id);
	};
	if(target.classList.contains('cart-btn-minus')){
		const id = target.closest('.cart-item').dataset.id;
		cart.minusGood(id);
	};
})
/* Модалка */
const openModal = () =>{
	modalCart.classList.add('show');
	cart.renderCart();
}

const closeModal = () =>{
	modalCart.classList.remove('show');
}
buttonCart.addEventListener('click', openModal);
modalCart.addEventListener('click', event => {
	if (event.target == modalCart || event.target == modalClose) {
        closeModal();
    }
});

/* Прокрутка */
const scrollUp = () =>{
	const elem = 'body';
	document.querySelector(elem).scrollIntoView({
		behavior: 'smooth',
		block: 'start',
	});
}

{
	const scrollLink = document.querySelectorAll('a.scroll-link');

for (let i = 0; i< scrollLink.length; i++){
	scrollLink[i].addEventListener('click', event =>{
		event.preventDefault();
		const id = scrollLink[i].getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	})
}
}


const createCard = function ({label,img, name, description,id, price}){
	const card = document.createElement('div');
	card.className ='col-lg-3 col-sm-6';
	card.innerHTML = `
	<div class="goods-card">
		${label ? `<span class="label">${label}</span>`: ''}
		<img src="db/${img}" alt="${name}" class="goods-image">
		<h3 class="goods-title">${name}</h3>
		<p class="goods-description">${description}</p>
		<button class="button goods-card-btn add-to-cart" data-id="${id}">
		<span class="button-price">${price} руб.</span>
		</button>
	</div>
	`;
	return card;
}


const renderCards = data =>{
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
};

more.addEventListener('click', event =>{
	event.preventDefault();
	getGoods().then(renderCards);
	scrollUp();
})

const filterCards = function(field,value){
	getGoods()
		.then(data => data.filter( good => good[field] === value))
		.then(renderCards);
};

const getFilter = link =>{
	const field = link.dataset.field;
	const value = link.dataset.value;
	if(value == 'All' || field == '')
			getGoods().then(renderCards);
		else
			filterCards(field,value);
}

navigationLink.forEach(link => {
	link.addEventListener('click', event =>{
		event.preventDefault();
		getFilter(link);
		scrollUp();
	})
})

bannersLink.forEach(bannerLink => {
	bannerLink.addEventListener('click', event =>{
		event.preventDefault();
		getFilter(bannerLink);
		scrollUp();
	})
})

const modalForm = document.querySelector('.modal-form');

const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser,
});

modalForm.addEventListener('submit', event => {
	event.preventDefault();
	const formData = new FormData(modalForm);
	formData.append('cart', JSON.stringify(cart.cartGoods))
	if(formData.get('nameCustomer') == '' || formData.get('phoneCustomer') == ''){
		console.log('Не заполнены пользовательские поля');
	}else{
		if(cart.cartGoods.length <= 0 ){
			console.log('Пустая корзина');
		}else{
			console.log('Все отлично, можно отправлять!');
			postData(formData)
		.then(response => {
			if(!response.ok){
				throw new Error(response.status);
			}
			alert('Ваш заказ успешно отправлен, с вами свяжутся!');
		})
		.catch(err => {
			alert('Произошла ошибка, повторите попытку позже');
			console.error(err);
		})
		.finally(()=>{
			closeModal();
			modalForm.reset();
			cart.cartClear();
		});
		}
	}
	
	/**/
});