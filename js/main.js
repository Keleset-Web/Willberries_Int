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

const openModal = function(){
	modalCart.classList.add('show');
}

const closeModal = function(){
	modalCart.classList.remove('show');
}
buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
window.addEventListener('click', function (event) {
	if (event.target == modalCart) {
        closeModal();
    }
});

{
	const scrollLink = document.querySelectorAll('a.scroll-link');

for (let i = 0; i< scrollLink.length; i++){
	scrollLink[i].addEventListener('click', function(event){
		event.preventDefault();
		const id = scrollLink[i].getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	})
}
}
