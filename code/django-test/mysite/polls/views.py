'''
Each view is responsible for doing one of two things:
 returning an HttpResponse object containing the content
  for the requested page, or raising an exception such as
   Http404. The rest is up to you.
'''
from django.shortcuts import get_object_or_404,render
from django.http import HttpResponse
from django.http import Http404

from django.template import loader

from .models import Question


def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {'latest_question_list': latest_question_list}
    return render(request, 'polls/index.html', context)

# def index(request):
#     latest_question_list = Question.objects.order_by('-pub_date')[:5]
#     template = loader.get_template('polls/index.html')
#     context = {
#         'latest_question_list': latest_question_list,
#         }
#     return HttpResponse(template.render(context, request))
# Leave the rest of the views (detail, results, vote) unchanged


def detail(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    return render(request, 'polls/detail.html', {'question': question})

def results(request, question_id):
    response = "You're looking at the results of question %s."
    return HttpResponse(response % question_id)

def vote(request, question_id):
    return HttpResponse("You are voting on question %s."% question_id)