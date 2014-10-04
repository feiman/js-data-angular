(function (window, angular, undefined) {
  'use strict';

  var adapters = [
    {
      project: 'js-data-http',
      name: 'http',
      class: 'DSHttpAdapter'
    }
  ];

  function registerAdapter(adapter) {
    var Adapter;

    try {
      Adapter = require(adapter.project);
    } catch (e) {

    }

    if (!Adapter) {
      Adapter = window[adapter.class];
    }

    if (Adapter) {
      adapter.loaded = true;
      angular.module(adapter.project, ['ng']).provider(adapter.class + 'Provider', function () {
        var _this = this;
        _this.defaults = {};
        _this.$get = [function () {
          return new Adapter(_this.defaults);
        }];
      });
    }
  }

  for (var i = 0; i < adapters.length; i++) {
    registerAdapter(adapters[i]);
  }

  var JSData;

  try {
    JSData = require('js-data');
  } catch (e) {

  }

  if (!JSData) {
    JSData = window.JSData;
  }

  if (!JSData) {
    throw new Error('js-data must be loaded!');
  }

  angular.module('js-data', ['ng'])
    .factory('DSUtils', JSData.DSUtils)
    .factory('DSErrors', JSData.DSErrors)
    .provider('DS', function () {

      var _this = this;
      var deps = [];

      for (var i = 0; i < adapters.length; i++) {
        if (adapters[i].loaded) {
          deps.push(adapters[i].class);
        }
      }

      _this.defaults = {};

      deps.push(function () {
        var store = new JSData.DS(_this.defaults);

        for (var i = 0; i < adapters.length; i++) {
          if (adapters[i].loaded) {
            store.registerAdapter(adapters[i].name, arguments[i]);
          }
        }

        return new JSData.DS(_this.defaults);
      });

      _this.$get = deps;
    });

})(window, window.angular);
