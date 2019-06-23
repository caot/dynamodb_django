from django.views.generic import ListView as generic_ListView
from django.http.response import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder

import json
import logging

from django.conf import settings
# from boto.s3.bucket import Bucket
# from boto.file.bucket import Bucket

import models
import os
import time

'''
http://127.0.0.1:8000/search
'''


class ListView(generic_ListView):
    def get_queryset(self):
        return None


class Html(ListView):
    template_name = 'html.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        html = os.getcwd() + settings.STATIC_URL + 'html'

        for _root, _dirs, files in os.walk(os.path.abspath(html)):
            kwargs.update(dict(files=files))

            return kwargs


class Status(ListView):
    def post(self, request, *args, **kwargs):
        print('    ====> ', 'POST')
        logging.info('POST')

        return self.get(request, *args, **kwargs)

#     def get_context_data(self, *, object_list=None, **kwargs):
#         if self.request.method == 'GET' and not self.request.is_ajax():
#             return {}
#
#         context = super(Search, self).get_context_data(
#             object_list=object_list, **kwargs)
#
#         html = os.getcwd() + settings.STATIC_URL + 'html' + 'eact_ajax_fetch.html'
#
#         moddate = os.stat(html)[8]
#
# #         context.update(data)
#         print('    ====> ', time.ctime(moddate))
#
#         return context

    def get(self, request, *args, **kwargs):
        url = request.GET.get('url', '')

#         print('    ====> GET')

        tokens = url.split('/static/')
        items = {}
        if len(tokens) == 2:
            filename = tokens[len(tokens) - 1]

            if bool(filename):
                html = os.getcwd() + settings.STATIC_URL + filename

                try:
                    moddate = os.stat(html)[8]

#                     print('    ====> ', os.stat(html))
#                     print('    ====> ', time.timezone)
#                     print('    ====> ', moddate)
#                     print('    ====> ', time.ctime(moddate))
                    items.update(
                        dict(moddate=moddate, ctime=time.ctime(moddate)))
                except Exception as e:
                    items.update(dict(e=e))

#         print('    ====> items = ', items)
        return HttpResponse(json.dumps(items, cls=DjangoJSONEncoder), content_type='application/json')


class Search(ListView):
    template_name = 'search.html'
    object_list = None

    def post(self, request, *args, **kwargs):
        logging.info('POST')

        return self.get(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        logging.info('request.is_ajax() = %s' % request.is_ajax())
        # self.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
        if request.is_ajax():
            items = self.get_context_data()
            items.pop('view')
            return HttpResponse(json.dumps(items, cls=DjangoJSONEncoder), content_type='application/json')

        return super(Search, self).get(request, *args, **kwargs)

    def get_context_data(self, *, object_list=None, **kwargs):
        if self.request.method == 'GET' and not self.request.is_ajax():
            return {}

        context = super(Search, self).get_context_data(
            object_list=object_list, **kwargs)
        REQUEST = self.request.GET or self.request.POST
        data = self.get_data(REQUEST)

        context.update(data)

        return context

    def get_data(self, param):
        '''
        "AttributeType": "S | N | B"
        '''
        filter_expression = []
        expression_attribute_names = {}
        expression_attribute_values = {}

        net_worth = param.get('net_worth', None)
        if bool(net_worth):
            filter_expression.append('(#net_worth <= :net_worth)')
            expression_attribute_names['#net_worth'] = 'net_worth'
            expression_attribute_values[':net_worth'] = int(net_worth)

        city = param.get('city', None)
        if bool(city):
            filter_expression.append('(#city = :city)')
            expression_attribute_names['#city'] = 'city'
            expression_attribute_values[':city'] = city

        context = models.Person().scan(filter_expression, expression_attribute_names,
                                       expression_attribute_values)

        return context
