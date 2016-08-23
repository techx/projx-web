angular.module('projx').controller('forumController', function ($scope) {
    var fakeThreads = [{
        'id': '1',
        'author': 'vfazel',
        'date': 'Jun 8, 2016',
        'title': 'Why can\'t I get my header to fit in this card? I want to write a very long header here.',
        'content': 'Why can\'t I get my header to fit in this card? I want to write a very long header here.'
    }, {
        'id': '12',
        'author': 'vfazel',
        'date': 'Jun 8, 2016',
        'title': 'Why can\'t I get my header to fit in this card? I want to write a very long header here.',
        'content': 'Why can\'t I get my header to fit in this card? I want to write a very long header here.'
    }, {
        'id': '123',
        'author': 'vfazel',
        'date': 'Jun 8, 2016',
        'title': 'Why can\'t I get my header to fit in this card? I want to write a very long header here.',
        'content': 'Why can\'t I get my header to fit in this card? I want to write a very long header here.'
    }, {
        'id': '1234',
        'author': 'vfazel',
        'date': 'Jun 8, 2016',
        'title': 'Why can\'t I get my header to fit in this card? I want to write a very long header here.',
        'content': 'Why can\'t I get my header to fit in this card? I want to write a very long header here.'
    }, {
        'id': '12345',
        'author': 'vfazel',
        'date': 'Jun 8, 2016',
        'title': 'Why can\'t I get my header to fit in this card? I want to write a very long header here.',
        'content': 'Why can\'t I get my header to fit in this card? I want to write a very long header here.'
    }];

    $scope.threads = fakeThreads;

    $scope.truncate = function (text, cutoff) {
        if (text.length > cutoff) {
            return text.substring(0, cutoff) + '...';
        } else {
            return text;
        }
    }
});
