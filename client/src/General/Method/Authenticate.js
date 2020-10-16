export const authenticate = (data, next) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('jwt', JSON.stringify(data))
		next()
	}
}

export const isAuthenticated = () => {
	if (typeof window == 'undefined') {
		return false
	}
	if (localStorage.getItem('jwt')) {
		return JSON.parse(localStorage.getItem('jwt'))
	} else {
		return false
	}
}

export const updateProfile = (user, next) => {
	if (typeof window !== 'undefined') {
		if (localStorage.getItem('jwt')) {
			let auth = JSON.parse(localStorage.getItem('jwt'))
			auth.user = user
			localStorage.setItem('jwt', JSON.stringify(auth))
			next()
		}
	}
}
