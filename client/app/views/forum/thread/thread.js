angular.module('projx').controller('threadController', function ($scope, $routeParams) {
    $scope.id = $routeParams.threadId;

    $scope.thread = {
        'title': 'thread title goes here'
    }

    $scope.posts = [
        {
            'content': 'This is the post content. I am posting about a question for my project that is designed to build something for something and hopefully it\'ll end up being useful for someone',
            'author': 'vfazel',
            'date': '8:21pm, Jun 23, 2016'
        },
        {
            'content': 'This is the post content. I am posting about a question for my project that is designed to build something for something and hopefully it\'ll end up being useful for someone',
            'author': 'vfazel',
            'date': '8:21pm, Jun 23, 2016'
        },
        {
            'content': 'This is the post content. I am posting about a question for my project that is designed to build something for something and hopefully it\'ll end up being useful for someone',
            'author': 'vfazel',
            'date': '8:21pm, Jun 23, 2016'
        },
        {
            'content': 'This is the post content. I am posting about a question for my project that is designed to build something for something and hopefully it\'ll end up being useful for someone',
            'author': 'vfazel',
            'date': '8:21pm, Jun 23, 2016'
        }
    ]
});
