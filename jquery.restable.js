/*! ReStable v0.1.1 by Alessandro Benoit */

/* --------
    EDITED by skerichards 2014-01-17
    changed cell calls from .text() to .html()
    added option for a footer with a single cell which spans the full table
    changed list ID output to reflect original element ID or class, or generic if neither is available

    TO DO: thead needs support for multiple rows
-------- */

(function ($, window, i) {

    'use strict';

    $.fn.ReStable = function (options) {

        // Settings
        var s = $.extend({
            rowHeaders: true,
            singleFooter: false,
            maxWidth: 480
        }, options);

        // Build the responsive menu container and fill it with build_menu()
        function create_responsive_table(element) {

            var $cols = [],
                $result = {},
                $cols_header = $(element).find('thead').find('tr').children('td,th'),
                $cols_footer = $(element).find('tfoot').find('tr').children('td,th').html(),
                $row_number = 0,
                $list;

            // header
            if (s.rowHeaders) {
                $cols_header = $cols_header.slice(1);
            }

            $cols_header.each(function () {
                $cols.push($(this).html());
            });
            // footer
            if (s.singleFooter) {

                // find only the tbody content
                $(element).find('tbody').find('tr').slice(0).each(function () {

                    var $row = $(this);
                    $row_number += 1;

                    $.each($cols, function (index, value) {
                        index += 1;

                        if (s.rowHeaders) {
                            if (!$result[value]) { $result[value] = {}; }
                            $result[value][$row.children('td:nth-child(1)').html()] = $row.children('td:nth-child(' + (index + 1) + ')').html();
                        } else {
                            if (!$result[$row_number]) { $result[$row_number] = {}; }
                            $result[$row_number][value] = $row.children('td:nth-child(' + index + ')').html();
                        }

                    });

                });

            } else {

                // Costruisce un array con il contenuto: $result
                $(element).find('tr').slice(1).each(function () {

                    var $row = $(this);
                    $row_number += 1;

                    $.each($cols, function (index, value) {

                        index += 1;

                        if (s.rowHeaders) {
                            if (!$result[value]) { $result[value] = {}; }
                            $result[value][$row.children('td:nth-child(1)').html()] = $row.children('td:nth-child(' + (index + 1) + ')').html();
                        } else {
                            if (!$result[$row_number]) { $result[$row_number] = {}; }
                            $result[$row_number][value] = $row.children('td:nth-child(' + index + ')').html();
                        }

                    });

                });

            }

            // get a name for the list
            var $list_id = $(element).attr('id') + '-list';
            if ($list_id === 'undefined-list') {
                var $list_id = $(element).attr('class') + '-list';
            }
            if ($list_id === '-list') {
                var $list_id = 'tabletolist';
            }

            // Crea la lista
            $list = $('<ul/>', {
                class: 'tabletolist ' + ((s.rowHeaders) ? 'rh' : 'nrh') + ' ' + ((s.singleFooter) ? 'sf' : 'nsf'),
                id: $list_id
            }).insertBefore($(element));
            $.each($result, function (index, value) {

                var $myrow = $('<li/>', {
                    html: (s.rowHeaders) ? '<span class="titles">' + index + '</span>' : ''
                }).appendTo($list),
                    $myrowul = $('<ul/>').appendTo($myrow);

                $.each(value, function (index, value) {

                    $('<li/>', {
                        html: '<span class="row_headers">' + index + '</span> <span class="row_data">' + value + '</span>'
                    }).appendTo($myrowul);

                });

            });

            if (s.singleFooter) {
                $('<li/>', {
                    html: $cols_footer
                }).addClass('footnotes').appendTo($list);
            }

            return $list;

        }

        // Let's do it
        this.each(function () {

            var element = $(this),
                responsive_table;

            i += 1;

            // The responsive menu is built if the page size is or goes under maxWidth
            function handle_table() {

                if ($(window).width() > parseInt(s.maxWidth, 10)) {

                    $(element).show();

                    if (responsive_table) {
                        $(responsive_table).hide();
                    }

                } else {

                    $(element).hide();

                    if (responsive_table) {
                        $(responsive_table).show();
                    } else {
                        responsive_table = create_responsive_table(element, i);
                    }

                }

            }

            // At first
            handle_table();

            // Then at the resizing of the page
            $(window).resize(function () {
                handle_table();
            });

        });

    };

    $.ReStable = function (options) {
        $('table').ReStable(options);
    };

}(jQuery, this, 0));