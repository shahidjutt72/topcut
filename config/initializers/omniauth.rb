Rails.application.config.middleware.use OmniAuth::Builder do	
	provider :facebook, '1571098119782327', 'a8f11136f246cb127661a1dad243433c'
end