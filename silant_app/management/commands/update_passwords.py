
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Update passwords for users with plain text passwords'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        users = User.objects.all()
        for user in users:
            if not user.password.startswith('pbkdf2_sha256$'):  # Проверка, если пароль не хэширован
                print(f'Updating password for user: {user.username}')
                user.set_password(user.password)
                user.save()
        print('All passwords updated successfully.')
