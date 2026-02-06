def calculate_refund(booking):
    today = booking.checkin_date

    if today > booking.checkin_date:
        return 0

    return booking.amount
