from firebase_admin import messaging as fcm

def send_approve_notification(user, post):
    # If the token belongs to multiple devices, get it from the list.
    tokens = list(user.fcm_tokens.values_list('token', flat=True))

    if not tokens: return

    # init notification
    message = fcm.MulticastMessage(
        data={
            "title": "Bài đăng đã được duyệt",
            "body": f"'{post.title}' đã được duyệt.",
            "post_id": str(post.id),
            "status": "approved"
        },
        tokens=tokens # send notif to all devices
    )

    # send
    response = fcm.send_each_for_multicast(message)

    # debug
    for idx, resp in enumerate(response.responses):
        if resp.success:
            print(f"Token {tokens[idx]}: success")
        else:
            print(f"Token {tokens[idx]}: error {resp.exception}")
    print(f"FCM sent: {response.success_count} success, {response.failure_count} fail")
