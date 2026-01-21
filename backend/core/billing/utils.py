import razorpay
from django.conf import settings

razorpay_client = razorpay.Client(
    auth=('rzp_test_S3lDuRfyT9Tdnd', 'rJ4e67SYQy9w3FMmLGfEIAz6')
)
