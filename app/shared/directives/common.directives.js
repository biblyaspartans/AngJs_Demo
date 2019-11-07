(function () {
    'use strict';

    angular.module('app').directive("regExInput", function () {
        "use strict";
        return {
            restrict: "A",
            require: "?regEx",
            scope: {},
            replace: false,
            link: function (scope, element, attrs, ctrl) {
                element.bind('keypress', function (event) {
                    var regex = new RegExp(attrs.regEx);
                    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                    if (!regex.test(key)) {
                        event.preventDefault();
                        return false;
                    }
                });
            }
        };
    });
    
    angular.module('app').directive('loading', function () {
      return {
          restrict: 'E',
          replace: true,
          template: ' <div id="loader-wrapper" class="main-progress"><div id="loader" class="sub-progress"></div><div class="loader-section section-left"></div><div class="loader-section section-right"></div></div>',
          link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
          }
      }
    })

    //angular.module('app').directive('loading', function () {
    //    return {
    //        restrict: 'E',
    //        replace: true,
    //        template: ' <div class="main-progress"><div class="sub-progress"><div class="loading"><img src="/assets/images/Loader.gif" />LOADING...</div></div></div>',
    //        link: function (scope, element, attr) {
    //            scope.$watch('loading', function (val) {
    //                if (val)
    //                    $(element).show();
    //                else
    //                    $(element).hide();
    //            });
    //        }
    //    }
    //})


    angular.module('app').directive("compareTo", function() {
            return {
                require: "ngModel",
                scope: {
                    otherModelValue: "=compareTo"
                },
                link: function(scope, element, attributes, ngModel) {
             
                    ngModel.$validators.compareTo = function(modelValue) {
                        return modelValue == scope.otherModelValue;
                    };
 
                    scope.$watch("otherModelValue", function() {
                        ngModel.$validate();
                    });
                }
            };
        });

    angular.module('app').directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

    angular.module('app').directive('modal', function () {
        return {
            template: '<div class="modal fade">' +
                '<div class="modal-dialog">' +
                  '<div class="Bmodal-content">' +
                //'<div class="modal-header">' +
                '<div style="padding:20px">' +
                    '<div class="row ModalTitleRow" >' +
                         '<div class="col-md-1"></div>' +
                         '<div class="col-md-10 ModalTitle" >Grievances Details</div>' +
                         '<div class="col-md-1">' +
                          '<button type="button" class="Bclose ModalCancelBtn" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                        '</div>' +
                    '</div>' +

                    '<div class="modal-body">' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title ModalTitlesFont" ><label>Ticket Number </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.TicketNo}}</div>' +
                    '</div>' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title ModalTitlesFont"><label>Raise Date </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.RaiseDate}}</div>' +
                    '</div>' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title"><label>Product </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.Product}}</div>' +
                    '</div>' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title ModalTitlesFont"><label>Grievance Type </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.GrievanceType}}</div>' +
                    '</div>' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title ModalTitlesFont"><label>Reference Number </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.ReferenceNumber}}</div>' +
                    '</div>' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title ModalTitlesFont"><label>Status </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.Status}}</div>' +
                    '</div>' +

                    '<div class="row">' +
                    '<div class="col-md-4 modal-title ModalTitlesFont"><label>Query Details </label></div>' +
                    '<div class="col-md-8 modal-title">{{grievanceViewDetails.QueryDetails}}</div>' +
                    '</div>' +

                   // '<div class="modal-body" ng-transclude></div>' +
                //    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.$watch(attrs.visible, function (value) {
                    if (value == true) {
                        $(element).modal('show');
                    }
                    else {
                        $(element).modal('hide');
                    }
                });

                $(element).on('shown.bs.modal', function () {
                    scope.$apply(function () {

                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    });

})();