// NCJ - Notion Color Jquery
let NCJ = $.noConflict(true);

function getColor(value, vector) {
    let v = 0;
    if (vector == 'color-min-max') {
        v = ((value) * 120);
    } else {
        v = ((1 - value) * 120);
    }
    let hue = v.toString(10);
    return ["hsla(", hue, ",100%,50%, 0.3)"].join("");
}

setTimeout(function () {
    let color_start = []
    if (localStorage.getItem('color_start') != undefined) {
        color_start = JSON.parse(localStorage.getItem('color_start'))
    }

    NCJ('.notion-table-view > .notion-selectable:not(.notion-collection-item)').each(function () {
            if (color_start.indexOf(NCJ(this).data('block-id')) != -1) {
                NCJ(this).addClass('notion-color-table');
                let arrs_sort = NCJ(this).find("div:contains('{sort-color}')");
                if (arrs_sort.length >= 6) {
                    arrs_sort.splice(0, 2);
                    for (let i = 0; i < arrs_sort.length / 6; i++) {
                        let vector = 'min';
                        let NCJhead = NCJ(arrs_sort[i * 5 + 2]);
                        NCJhead.css({color: "red"});
                        if (NCJhead.text().indexOf('{color-min-max}') != -1) {
                            vector = 'color-min-max'
                        }
                        if (NCJhead.text().indexOf('{color-max-min}') != -1) {
                            vector = 'color-max-min'
                        }
                        let index = NCJ(arrs_sort[i * 5]).index();
                        let values = NCJ(this).find('.notion-collection-item > div:nth-child(' + (index + 1) + ')');
                        if (values.length > 0) {
                            let min = 0;
                            let max = 0;
                            if (NCJ(values[0]).text().indexOf('%') == -1) {
                                min = parseInt(NCJ(values[0]).text());
                                values.each(function () {
                                    let text = NCJ(this).text();
                                    let value = 0;
                                    if (text != '') {
                                        value = parseInt(text);
                                    }

                                    if (value < min) {
                                        min = value
                                    }

                                    if (value > max) {
                                        max = value;
                                    }

                                });
                            } else {
                                min = 0;
                                max = 100;
                            }

                            let mid = max - min;
                            values.each(function () {
                                let text = NCJ(this).text().replace('%', '');
                                let value = 0;
                                if (text != '') {
                                    value = parseInt(text);
                                }
                                NCJ(this).css({background: getColor((value - min) / mid, vector)});

                            })
                        }
                    }
                }
                let arrs_color = NCJ(this).find("div:contains('{bool-color:')");
                if (arrs_color.length >= 6) {
                    arrs_color.splice(0, 2);
                    let name = NCJ(arrs_color[0]).text();
                    let req = Array.from(name.matchAll(/.*\{bool-color:(.*):(.*)\}/g));
                    if (req.length == 1) {
                        let color_off = req[0][1];
                        let color_on = req[0][2];
                        for (let i = 0; i < arrs_color.length / 6; i++) {
                            let index = NCJ(arrs_color[i * 5]).index();
                            let values = NCJ(this).find('.notion-collection-item > div:nth-child(' + (index + 1) + ')');
                            values.each(function () {
                                if (NCJ(this).find('.check').length > 0) {
                                    NCJ(this).css({background: color_off});
                                } else {
                                    NCJ(this).css({background: color_on});
                                }
                            })
                        }
                    }
                }
                let arrs_bool = NCJ(this).find("div:contains('{color:')");
                if (arrs_color.length >= 6) {
                    arrs_color.splice(0, 2);
                    let name = NCJ(arrs_color[0]).text();
                    let req = Array.from(name.matchAll(/.*\{color:(.*)\}/g));
                    if (req.length == 1) {
                        let color = req[0][1];
                        for (let i = 0; i < arrs_color.length / 6; i++) {
                            let index = NCJ(arrs_color[i * 5]).index();
                            let values = NCJ(this).find('.notion-collection-item > div:nth-child(' + (index + 1) + ')');
                            values.each(function () {
                                NCJ(this).css({background: color});
                            })
                        }
                    }
                }
                NCJ(this).append('<div class="notion-color-start" data-block-id="' + NCJ(this).data('block-id') + '">off</div>')
            } else {
                NCJ(this).append('<div class="notion-color-start" data-block-id="' + NCJ(this).data('block-id') + '">on</div>')
            }
        }
    )

    NCJ(document).on('click', '.notion-color-start', function () {
        let index = color_start.indexOf(NCJ(this).data('block-id'));
        if (index != -1) {
            color_start.splice(index, 1);
            NCJ(this).text('on');
        } else {
            color_start.push(NCJ(this).data('block-id'));
            NCJ(this).text('off');
        }
        localStorage.setItem('color_start', JSON.stringify((color_start)));
    });


}, 6000)