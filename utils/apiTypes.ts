export interface CardDTO {
	id: string
	content: string
	score: number
	link: string | null
}

export const isCardDTO = (card: unknown): card is CardDTO => {
	if (typeof card !== 'object' || card === null) return false

	return (
		card.hasOwnProperty('id') &&
		typeof (card as CardDTO).id === 'string' &&
		card.hasOwnProperty('content') &&
		typeof (card as CardDTO).content === 'string' &&
		card.hasOwnProperty('score') &&
		typeof (card as CardDTO).score === 'number' &&
		card.hasOwnProperty('link') &&
		(typeof (card as CardDTO).link === 'string' || typeof (card as CardDTO).link === null)
	)
}

export interface CardMetadataWithVotes {
	id: string
	author: UserDTO | null
	content: string
	link: string | null
	qdrant_point_id: string
	total_upvotes: number
	total_downvotes: number
	vote_by_current_user: boolean | null
	created_at: string
	updated_at: string
}

const isCardMetadataWithVotes = (card: unknown): card is CardMetadataWithVotes => {
	if (typeof card !== 'object' || card === null) return false

	return (
		card.hasOwnProperty('id') &&
		typeof (card as CardMetadataWithVotes).id === 'string' &&
		card.hasOwnProperty('author') &&
		(isUserDTO((card as CardMetadataWithVotes).author) ||
			(card as CardMetadataWithVotes).author === null) &&
		card.hasOwnProperty('content') &&
		typeof (card as CardMetadataWithVotes).content === 'string' &&
		card.hasOwnProperty('qdrant_point_id') &&
		typeof (card as CardMetadataWithVotes).qdrant_point_id === 'string' &&
		card.hasOwnProperty('total_upvotes') &&
		typeof (card as CardMetadataWithVotes).total_upvotes === 'number' &&
		card.hasOwnProperty('total_downvotes') &&
		typeof (card as CardMetadataWithVotes).total_downvotes === 'number' &&
		card.hasOwnProperty('vote_by_current_user') &&
		(typeof (card as CardMetadataWithVotes).vote_by_current_user === 'boolean' ||
			(card as CardMetadataWithVotes).vote_by_current_user === null) &&
		card.hasOwnProperty('created_at') &&
		typeof (card as CardMetadataWithVotes).created_at === 'string' &&
		card.hasOwnProperty('updated_at') &&
		typeof (card as CardMetadataWithVotes).updated_at === 'string'
	)
}

export interface ScoreCardDTO {
	metadata: CardMetadataWithVotes
	score: number
}

export const isScoreCardDTO = (card: unknown): card is ScoreCardDTO => {
	if (typeof card !== 'object' || card === null) return false

	return (
		card.hasOwnProperty('metadata') &&
		isCardMetadataWithVotes((card as ScoreCardDTO).metadata) &&
		card.hasOwnProperty('score') &&
		typeof (card as ScoreCardDTO).score === 'number'
	)
}

export interface ActixApiDefaultError {
	message: string
}

export const isActixApiDefaultError = (data: unknown): data is ActixApiDefaultError => {
	return (
		typeof data === 'object' &&
		data !== null &&
		'message' in data &&
		typeof (data as ActixApiDefaultError).message === 'string'
	)
}

export const detectReferralToken = (queryParamT: string | undefined | null) => {
	if (queryParamT) {
		let previousTokens: string[] = []
		const previousReferralToken = window.localStorage.getItem('referralToken')
		if (previousReferralToken) {
			const previousReferralTokenArray: string[] = JSON.parse(
				previousReferralToken
			) as unknown as string[]
			previousTokens = previousReferralTokenArray
			if (previousTokens.find((val) => val === queryParamT)) {
				return
			}
		}
		previousTokens.push(queryParamT)
		window.localStorage.setItem('referralToken', JSON.stringify(previousTokens))
	}
}

export const getReferralTokenArray = (): string[] => {
	const previousReferralToken = window.localStorage.getItem('referralToken')
	if (previousReferralToken) {
		const previousReferralTokenArray: string[] = JSON.parse(
			previousReferralToken
		) as unknown as string[]
		return previousReferralTokenArray
	}
	return []
}

export interface UserDTO {
	id: string
	email: string | null
	username: string | null
	website: string | null
	visible_email: boolean
}

export const isUserDTO = (user: unknown): user is UserDTO => {
	if (typeof user !== 'object' || user === null) return false

	return (
		user.hasOwnProperty('id') &&
		typeof (user as UserDTO).id === 'string' &&
		user.hasOwnProperty('email') &&
		(typeof (user as UserDTO).email === 'string' || (user as UserDTO).email === null) &&
		user.hasOwnProperty('username') &&
		(typeof (user as UserDTO).username === 'string' || (user as UserDTO).username === null) &&
		user.hasOwnProperty('website') &&
		(typeof (user as UserDTO).website === 'string' || (user as UserDTO).website === null) &&
		user.hasOwnProperty('visible_email') &&
		typeof (user as UserDTO).visible_email === 'boolean'
	)
}
