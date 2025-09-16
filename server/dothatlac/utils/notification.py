from firebase_admin import messaging as fcm

def send_message_notification(user, current_user):
    # If the token belongs to multiple devices, get it from the list.
    tokens = list(user.fcm_tokens.values_list('token', flat=True))

    message = fcm.MulticastMessage(
        data={
            "type": "message",
            "user_chat_id": str(current_user.id),
        },
        tokens=tokens,
    )

    fcm.send_each_for_multicast(message)

def send_reject_notification(user, post, reason):
    # If the token belongs to multiple devices, get it from the list.
    tokens = list(user.fcm_tokens.values_list('token', flat=True))

    if not tokens: return

    # init notification
    message = fcm.MulticastMessage(
        data={
            "type": "post",
            "title": "Bài đăng không được duyệt",
            "body": f"'{post.title}' không được duyệt.",
            "reason": reason,
            "post_id": str(post.id),
            "status": "rejected"
        },
        tokens=tokens  # send notif to all devices
    )

    # send
    fcm.send_each_for_multicast(message)

def send_approve_notification(user, post):
    # If the token belongs to multiple devices, get it from the list.
    tokens = list(user.fcm_tokens.values_list('token', flat=True))

    if not tokens: return

    # init notification
    message = fcm.MulticastMessage(
        data={
            "type": "post",
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


