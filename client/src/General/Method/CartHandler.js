export const addProduct = (item = [], count = 0, next = f => f) => {
	let cart = []
	if (typeof window !== 'undefined') {
		if (localStorage.getItem('cart')) {
			cart = JSON.parse(localStorage.getItem('cart'))
		}
		cart.push({
			...item,
			count: 1,
		})

		cart = Array.from(new Set(cart.map(p => p._id))).map(id => {
			return cart.find(p => p._id === id)
		})

		localStorage.setItem('cart', JSON.stringify(cart))
		next()
	}
}

export const total = () => {
	if (typeof window !== 'undefined') {
		if (localStorage.getItem('cart')) {
			return JSON.parse(localStorage.getItem('cart')).length
		}
	}
	return 0
}

export const productsInCart = () => {
	if (typeof window !== 'undefined') {
		if (localStorage.getItem('cart')) {
			return JSON.parse(localStorage.getItem('cart'))
		}
	}
	return []
}

export const updateProduct = (productId, count) => {
	let cart = []
	if (typeof window !== 'undefined') {
		if (localStorage.getItem('cart')) {
			cart = JSON.parse(localStorage.getItem('cart'))
		}

		// eslint-disable-next-line array-callback-return
		cart.map((product, i) => {
			if (product._id === productId) {
				cart[i].count = count
			}
		})

		localStorage.setItem('cart', JSON.stringify(cart))
	}
}

export const removeProduct = productId => {
	let cart = []
	if (typeof window !== 'undefined') {
		if (localStorage.getItem('cart')) {
			cart = JSON.parse(localStorage.getItem('cart'))
		}

		// eslint-disable-next-line array-callback-return
		cart.map((product, i) => {
			if (product._id === productId) {
				cart.splice(i, 1)
			}
		})

		localStorage.setItem('cart', JSON.stringify(cart))
	}
	return cart
}

export const emptyCart = next => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('cart')
		next()
	}
}
