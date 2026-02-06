from rest_framework.throttling import SimpleRateThrottle

class OTPIPThrottle(SimpleRateThrottle):
    scope = 'otp_ip'

    def get_cache_key(self, request, view):
        return self.get_ident(request)
