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
                let arrs = NCJ(this).find("div:contains('{color}')");
                if (arrs.length >= 6) {
                    arrs.splice(0, 2);
                    for (let i = 0; i < arrs.length / 6; i++) {
                        let vector = 'min';
                        let NCJhead = NCJ(arrs[i * 5 + 2]);
                        NCJhead.css({color: "red"});
                        if (NCJhead.text().indexOf('{color-min-max}') != -1) {
                            vector = 'color-min-max'
                        }
                        if (NCJhead.text().indexOf('{color-max-min}') != -1) {
                            vector = 'color-max-min'
                        }
                        let index = NCJ(arrs[i * 5]).index();
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