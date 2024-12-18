from django import forms
from django.contrib.auth.forms import AuthenticationForm

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     self.fields['username'].label = 'Your Username'
    #     self.fields['password'].label = 'Your Password'
    #     self.fields['username'].widget.attrs['placeholder'] = 'Enter your username'
    #     self.fields['password'].widget.attrs['placeholder'] = 'Enter your password'
