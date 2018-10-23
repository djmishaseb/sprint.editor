var sprint_editor_admin = {

    create: function ($, params) {
        var $editor = $('.sp-x-editor' + params.uniqid);
        var $inputresult = $('.sp-x-result' + params.uniqid);
        var $form = $editor.closest('form').first();

        $editor.on('keypress', 'input', function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode === 13) {
                e.preventDefault();
                return false;
            }
        });

        $('form input').on('keypress', function (e) {
            return e.which !== 13;
        });

        if (!params.jsonValue) {
            params.jsonValue = {};
        }

        if (!params.jsonValue.blocks) {
            params.jsonValue.blocks = [];
        }

        if (!params.jsonValue.layouts) {
            params.jsonValue.layouts = [];
        }

        if (!params.jsonUserSettings) {
            params.jsonUserSettings = {};
        }

        $.each(params.jsonValue.layouts, function (index, layout) {
            layoutAdd(layout);
        });

        $.each(params.jsonValue.blocks, function (index, block) {
            blockAdd(block);
        });

        sprint_editor.listenEvent('focus', function () {
            checkClipboardButtons();
        });

        sprint_editor.listenEvent('copy', function () {
            checkClipboardButtons();
        });

        checkClipboardButtons();

        $form.on('submit', function (e) {
            //sprint_editor.deleteImagesBeforeSubmit();
            var resultString = saveToString();

            $editor.find('input,textarea,select').removeAttr('name');
            $inputresult.val(resultString);
        });

        if (params.enableChange) {

            $editor.on('click', '.sp-x-pack-save', function (e) {
                var packname = prompt(BX.message('SPRINT_EDITOR_pack_change'));
                if (packname) {
                    packSave('' + packname);
                }
            });

            $editor.on('click', '.sp-x-pack-del', function (e) {
                var packname = '???';
                if (packname.indexOf('pack_') === 0) {
                    packname = packname.substr(5);

                    if (confirm(BX.message('SPRINT_EDITOR_pack_del_confirm'))) {
                        packDelete(packname);
                    }

                } else {
                    alert(BX.message('SPRINT_EDITOR_pack_del_error'))
                }
            });

            $editor.on('click', '.sp-x-lt-col-copy', function (e) {
                e.preventDefault();
                var $col = $(this).closest('.sp-x-lt-col');
                $col.find('.sp-x-box').each(function () {
                    sprint_editor.copyToClipboard($(this).data('uid'));
                });
            });

            $editor.on('click', '.sp-x-lt-col-paste', function (e) {
                e.preventDefault();

                var $grid = $(this).closest('.sp-x-lt');
                var $col = $(this).closest('.sp-x-lt-col');

                var gindex = $editor.find('.sp-x-lt').index($grid);
                var cindex = $grid.find('.sp-x-lt-col').index($col);

                var clipboardData = sprint_editor.getClipboard();

                $.each(clipboardData, function (blockUid, blockData) {
                    blockData.layout = gindex + ',' + cindex;
                    blockAdd(blockData);
                });

                sprint_editor.clearClipboard();
            });

            $editor.on('click', '.sp-x-editor-pp .sp-x-btn', function (e) {
                var name = $(this).data('name');
                if (name.indexOf('layout_') === 0) {
                    name = name.substr(7);
                    layoutEmptyAdd(name);
                } else if (name.indexOf('pack_') === 0) {
                    name = name.substr(5);
                    packLoad(name);
                } else {
                    blockAdd({name: name});
                }

                popupClose();

            });

            $editor.on('click', '.sp-x-lt-col-add-box', function (e) {
                var $popup = $editor.find('.sp-x-editor-pp');

                if ($popup.length <= 0) {
                    var popuphtml = sprint_editor.renderTemplate('pp' + params.uniqid, {});
                    $popup = $(popuphtml);
                }

                var showPopup = false;

                if ($(this).hasClass('sp-active')) {
                    if ($popup.is(':hidden')) {
                        showPopup = true;
                    }
                } else {
                    showPopup = true;
                }

                if (showPopup) {
                    $editor.find('.sp-x-lt-col-add-box').not(this).removeClass('sp-active');
                    $(this).addClass('sp-active');

                    $(this).after($popup);

                    $popup.css({left: 0});
                    $popup.show();
                } else {
                    popupClose();

                }
            });

            $editor.on('click', '.sp-x-box-copy', function (e) {
                e.preventDefault();
                sprint_editor.copyToClipboard($(this).closest('.sp-x-box').data('uid'));
            });


            $editor.on('click', '.sp-x-lt-col-tab', function (e) {
                selectColumn($(this).data('uid'));
            });


            $editor.on('click', '.sp-x-box-up', function (e) {
                e.preventDefault();

                var block = $(this).closest('.sp-x-box');
                var col = $(this).closest('.sp-x-lt-col');
                var grid = $(this).closest('.sp-x-lt');

                var nblock = block.prev('.sp-x-box');
                if (nblock.length > 0) {
                    block.insertBefore(nblock);
                } else {
                    var ncol = col.prev('.sp-x-lt-col');
                    if (ncol.length > 0) {
                        block.appendTo(ncol);
                    } else {
                        var ngrid = grid.prev('.sp-x-lt');
                        if (ngrid.length > 0) {
                            var ncol = ngrid.find('.sp-x-lt-col').last();
                            if (ncol.length > 0) {
                                block.appendTo(ncol);
                            }
                        }

                    }
                }
            });

            $editor.on('click', '.sp-x-box-dn', function (e) {
                e.preventDefault();

                var block = $(this).closest('.sp-x-box');
                var col = $(this).closest('.sp-x-lt-col');
                var grid = $(this).closest('.sp-x-lt');

                var nblock = block.next('.sp-x-box');
                if (nblock.length > 0) {
                    block.insertAfter(nblock);
                } else {
                    var ncol = col.next('.sp-x-lt-col');
                    if (ncol.length > 0) {
                        var head = ncol.find('.sp-x-lt-settings');
                        if (head.length <= 0) {
                            head = ncol.find('.sp-x-lt-col-head');
                        }


                        block.insertAfter(head);
                    } else {
                        var ngrid = grid.next('.sp-x-lt');
                        if (ngrid.length > 0) {
                            var ncol = ngrid.find('.sp-x-lt-col').first();
                            if (ncol.length > 0) {

                                var head = ncol.find('.sp-x-lt-settings');
                                if (head.length <= 0) {
                                    head = ncol.find('.sp-x-lt-col-head');
                                }

                                block.insertAfter(head);
                            }
                        }

                    }
                }
            });

            $editor.on('click', '.sp-x-lt-up', function (e) {
                e.preventDefault();
                var block = $(this).closest('.sp-x-lt');
                var nblock = block.prev('.sp-x-lt');
                if (nblock.length > 0) {
                    block.insertBefore(nblock);
                }
            });

            $editor.on('click', '.sp-x-lt-dn', function (e) {
                e.preventDefault();
                var block = $(this).closest('.sp-x-lt');
                var nblock = block.next('.sp-x-lt');
                if (nblock.length > 0) {
                    block.insertAfter(nblock);
                }
            });

            $editor.on('click', '.sp-x-lt-col-left', function (e) {
                e.preventDefault();
                var block = $(this).closest('.sp-x-lt-col');
                var nblock = block.prev('.sp-x-lt-col');
                if (nblock.length > 0) {
                    block.insertBefore(nblock);
                }
            });

            $editor.on('click', '.sp-x-lt-col-right', function (e) {
                e.preventDefault();
                var block = $(this).closest('.sp-x-lt-col');
                var nblock = block.next('.sp-x-lt-col');
                if (nblock.length > 0) {
                    block.insertAfter(nblock);
                }
            });

            $editor.on('click', '.sp-x-box-del', function (e) {
                e.preventDefault();
                var $target = $(this).closest('.sp-x-box');

                var uid = $target.data('uid');
                sprint_editor.beforeDelete(uid);

                $target.hide(250, function () {
                    $target.remove();
                });
            });

            $editor.on('click', '.sp-x-lt-del', function (e) {
                e.preventDefault();

                var $grid = $(this).closest('.sp-x-lt');

                $grid.find('.sp-x-box').each(function () {
                    var uid = $(this).data('uid');
                    sprint_editor.beforeDelete(uid);
                });

                $grid.hide(250, function () {
                    $grid.remove();
                });

            });

            $editor.on('click', '.sp-x-lt-add-col', function (e) {
                e.preventDefault();
                var $grid = $(this).closest('.sp-x-lt');

                var newcount = $grid.find('.sp-x-lt-col').length + 1;

                if (newcount > 4) {
                    return;
                }

                var ltname = 'type' + newcount;

                var html = sprint_editor.renderTemplate('box-layout-col', {
                    enableChange: params.enableChange,
                    showSortButtons: params.showSortButtons,
                    showCopyButtons: params.showCopyButtons,
                    title: BX.message('SPRINT_EDITOR_col_default'),
                    compiledHtml: sprint_editor.renderTemplate('box-layout-col-settings', {
                        compiled: compileClasses(ltname, '')
                    })
                });

                $grid.append(html);

                $grid.find('.sp-x-lt-col').last().sortable({
                    items: ".sp-x-box",
                    connectWith: ".sp-x-lt-col",
                    handle: ".sp-x-box-handle",
                    placeholder: "sp-x-box-placeholder"
                });

                checkClipboardButtons();

            });

            $editor.on('click', '.sp-x-lt-col-del', function (e) {
                e.preventDefault();
                var $grid = $(this).closest('.sp-x-lt');
                var $col = $(this).closest('.sp-x-lt-col');

                $col.find('.sp-x-box').each(function () {
                    var uid = $(this).data('uid');
                    sprint_editor.beforeDelete(uid);
                });

                var colcount = $grid.find('.sp-x-lt-col').length;
                var newcount = colcount - 1;
                if (newcount > 0) {
                    $col.hide(250, function () {
                        $col.remove();
                    });
                } else {
                    $grid.hide(250, function () {
                        $grid.remove();
                    });
                }


            });

            $editor.on('click', '.sp-x-lt-edit', function (e) {
                var $title = $(this).closest('.sp-x-lt').find('.sp-x-lt-title');
                layoutEditTitle($title);
            });

            $editor.on('dblclick', '.sp-x-lt-title', function (e) {
                var $title = $(this);
                layoutEditTitle($title);
            });

            $editor.on('dblclick', '.sp-x-lt-col-title', function (e) {
                var $title = $(this);
                layoutEditColumnTitle($title);

            });

            $editor.on('click', '.sp-x-lt-col-edit', function (e) {
                var $title = $(this).closest('.sp-x-lt-col').find('.sp-x-lt-col-title');
                layoutEditColumnTitle($title);

            });
        }

        $editor.on('click', '.sp-x-box-settings span', function (e) {
            var $span = $(this);

            $span.siblings('span').removeClass('sp-active');

            if ($span.hasClass('sp-active')) {
                $span.removeClass('sp-active');
            } else {
                $span.addClass('sp-active');
            }
        });

        $editor.on('click', '.sp-x-lt-settings span', function (e) {
            var $span = $(this);

            $span.siblings('span').removeClass('sp-active');

            if ($span.hasClass('sp-active')) {
                $span.removeClass('sp-active');
            } else {
                $span.addClass('sp-active');
            }
        });

        function scrollTo($elem) {
            $(document).scrollTop($elem.offset().top - 80);
        }

        function popupClose() {
            $editor.find('.sp-x-lt-col-add-box').removeClass('sp-active');
            $editor.find('.sp-x-editor-pp').hide();
        }

        function checkClipboardButtons() {
            var clipboardData = sprint_editor.getClipboard();

            var cntBlocks = 0;
            $editor.find('.sp-x-box-copy').removeClass('sp-active');

            $.each(clipboardData, function (blockUid, blockData) {
                var $block = $editor.find('[data-uid=' + blockUid + ']');
                if ($block.length > 0) {
                    $block.find('.sp-x-box-copy').addClass('sp-active');
                }
                cntBlocks++;
            });

            if (cntBlocks > 0) {
                $editor.find('.sp-x-lt-col-paste').show();
            } else {
                $editor.find('.sp-x-lt-col-paste').hide();
            }
        }

        function layoutEmptyAdd(colCnt) {
            var ltname = 'type' + colCnt;

            var columns = [];
            var defaultclass = '';

            if (params.jsonUserSettings && params.jsonUserSettings.layout_defaults) {
                if (params.jsonUserSettings.layout_defaults[ltname]) {
                    defaultclass = params.jsonUserSettings.layout_defaults[ltname];
                }
            }

            for (var index = 1; index <= colCnt; index++) {
                columns.push({
                    css: defaultclass
                })
            }

            layoutAdd({
                columns: columns
            });
        }

        function layoutAdd(layout) {
            var ltname = 'type' + layout.columns.length;

            var columns = [];

            $.each(layout.columns, function (index, column) {
                var columnUid = sprint_editor.makeUid();
                columns.push({
                    uid: columnUid,
                    html: sprint_editor.renderTemplate('box-layout-col', {
                        enableChange: params.enableChange,
                        showSortButtons: params.showSortButtons,
                        showCopyButtons: params.showCopyButtons,
                        title: (column.title) ? column.title : BX.message('SPRINT_EDITOR_col_default'),
                        uid: columnUid,
                        compiledHtml: sprint_editor.renderTemplate('box-layout-col-settings', {
                            compiled: compileClasses(ltname, column.css)
                        })
                    })
                })
            });

            $editor.find('.sp-x-editor-lt').append(
                sprint_editor.renderTemplate('box-layout', {
                    enableChange: params.enableChange,
                    showSortButtons: params.showSortButtons,
                    showCopyButtons: params.showCopyButtons,
                    columns: columns,
                    title: (layout.title) ? layout.title : BX.message('SPRINT_EDITOR_lt_default')
                })
            );

            if (params.enableChange) {
                $editor.find('.sp-x-lt').last().find('.sp-x-lt-col').sortable({
                    items: ".sp-x-box",
                    connectWith: ".sp-x-lt-col",
                    handle: ".sp-x-box-handle",
                    placeholder: "sp-x-box-placeholder"
                });
            }

            checkClipboardButtons();
        }

        function blockPopupAdd(blockData) {
            if (!blockData || !blockData.name) {
                return false;
            }

            if (!sprint_editor.hasBlockParams(blockData.name)) {
                return false;
            }

            var $column = $editor.find('.sp-x-lt-col').last();

            var uid = sprint_editor.makeUid();
            var blockSettings = sprint_editor.getBlockSettings(blockData.name, params);
            var html = sprint_editor.renderBlock(blockData, blockSettings, uid, params);

            // var head = $column.find('.sp-x-lt-settings');
            // if (head.length <= 0) {
            //     head = $column.find('.sp-x-lt-col-head');
            // }

            // $(html).insertAfter(head);
            $column.append(html);

            // var $el = $column.find('.sp-x-box-block').first();
            var $el = $column.find('.sp-x-box-block').last();

            var entry = sprint_editor.initblock($, $el, blockData.name, blockData, blockSettings);
            sprint_editor.initblockAreas($, $el, entry);
            sprint_editor._entries[uid] = entry;


            //scrollTo($el);
        }

        function blockAdd(blockData) {
            if (!blockData || !blockData.name) {
                return false;
            }

            if (!sprint_editor.hasBlockParams(blockData.name)) {
                return false;
            }

            var uid = sprint_editor.makeUid();

            var blockSettings = sprint_editor.getBlockSettings(blockData.name, params);
            var html = sprint_editor.renderBlock(blockData, blockSettings, uid, params);

            if ($editor.find('.sp-x-lt-col').length <= 0) {
                layoutEmptyAdd(1);
            }

            var $column = false;
            if (blockData.layout) {
                var pos = blockData.layout.split(',');
                var $grid = $editor.find('.sp-x-lt').eq(pos[0]);
                $column = $grid.find('.sp-x-lt-col').eq(pos[1]);
            }

            if (!$column || $column.length <= 0) {
                $column = $editor.find('.sp-x-lt-col').last();
            }

            $column.append(html);

            var $el = $column.find('.sp-x-box-block').last();
            var entry = sprint_editor.initblock($, $el, blockData.name, blockData, blockSettings);
            sprint_editor.initblockAreas($, $el, entry);
            sprint_editor._entries[uid] = entry;
        }

        function packSave(packname) {
            $.post('/bitrix/admin/sprint.editor/assets/backend/pack.php', {
                save: saveToString(packname)
            }, function (resp) {

                if (resp && resp.select) {
                    sprint_editor.renderTemplate('box-select-pack', resp.select)
                }

                if (resp && resp.current) {
                }
            });
        }

        function packDelete(packname) {
            $.post('/bitrix/admin/sprint.editor/assets/backend/pack.php', {
                del: packname
            }, function (resp) {


                if (resp && resp.select) {
                    sprint_editor.renderTemplate('box-select-pack', resp.select)
                }

                if (resp && resp.current) {

                }

            });
        }

        function packLoad(packname) {
            $.get('/bitrix/admin/sprint.editor/assets/backend/pack.php', {
                load: packname
            }, function (pack) {

                if (!pack || !pack.layouts || !pack.blocks) {
                    return;
                }

                var layoutIndex = layoutCnt();

                $.each(pack.layouts, function (index, layout) {
                    layoutAdd(layout)
                });

                $.each(pack.blocks, function (index, block) {
                    var pos = block.layout;

                    pos = pos.split(',');

                    pos = [
                        parseInt(pos[0], 10) + layoutIndex,
                        parseInt(pos[1], 10)
                    ];

                    var newblock = $.extend({}, block, {
                        layout: pos.join(',')
                    });

                    blockAdd(newblock);
                });

            });


        }

        function layoutCnt() {
            return $editor.find('.sp-x-lt').length;
        }

        function selectColumn(columnUid) {
            var $column = $editor.find('[data-uid=' + columnUid + ']');
            $column.each(function () {
                if ($(this).hasClass('sp-x-lt-col-tab')) {
                    $(this).siblings('.sp-x-lt-col-tab').removeClass('sp-active');
                    $(this).addClass('sp-active');
                }

                if ($(this).hasClass('sp-x-lt-col')) {
                    $(this).siblings('.sp-x-lt-col').hide();
                    $(this).show();
                }
            });
        }

        function layoutEditTitle($title) {
            var newtitle = prompt(BX.message('SPRINT_EDITOR_lt_change'), $title.text());
            newtitle = $.trim(newtitle);

            if (newtitle) {
                $title.text(newtitle);
            }
        }

        function layoutEditColumnTitle($title) {
            var newtitle = prompt(BX.message('SPRINT_EDITOR_col_change'), $title.text());
            newtitle = $.trim(newtitle);

            if (newtitle) {
                $title.text(newtitle);
            }
        }

        function getClassTitle(cssname) {
            if (params.jsonUserSettings && params.jsonUserSettings.layout_titles) {
                if (params.jsonUserSettings.layout_titles[cssname]) {
                    if (params.jsonUserSettings.layout_titles[cssname].length > 0) {
                        return params.jsonUserSettings.layout_titles[cssname];
                    }
                }
            }

            return cssname;
        }

        function compileClasses(ltname, cssstr) {

            var selectedCss = cssstr.split(' ');

            var allclasses = {};
            if (params.jsonUserSettings && params.jsonUserSettings.layout_classes) {
                if (params.jsonUserSettings.layout_classes[ltname]) {
                    if (params.jsonUserSettings.layout_classes[ltname].length > 0) {
                        allclasses = params.jsonUserSettings.layout_classes[ltname]
                    }
                }
            }

            var compiled = [];

            if (!allclasses) {
                return compiled;
            }

            $.each(allclasses, function (groupIndex, groupClasses) {

                if (!$.isArray(groupClasses)) {
                    return true;
                }

                var value = [];
                var valSel = 0;

                $.each(groupClasses, function (cssIndex, cssName) {

                    valSel = (
                        $.inArray(cssName, selectedCss) >= 0
                    ) ? 1 : 0;

                    value.push({
                        title: getClassTitle(cssName),
                        value: cssName,
                        selected: valSel
                    })
                });


                compiled.push({
                    options: value
                })
            });

            return compiled;
        }

        function saveToString(packname) {
            packname = packname || '';

            var blocks = [];
            var layouts = [];

            var index = 0;

            $editor.find('.sp-x-lt').each(function (gindex) {
                var columns = [];
                var lttitle = $(this).find('.sp-x-lt-title').text();

                $(this).find('.sp-x-lt-col').each(function (cindex) {

                    var coltitle = $(this).find('.sp-x-lt-col-title').text();

                    var colclasses = [];
                    $(this).find('.sp-x-lt-settings .sp-active').each(function () {
                        var cssname = $(this).data('value');
                        colclasses.push(
                            $.trim(cssname)
                        );
                    });

                    if (coltitle !== BX.message('SPRINT_EDITOR_col_default')) {
                        columns.push({
                            title: coltitle,
                            css: colclasses.join(' ')
                        });
                    } else {
                        columns.push({
                            css: colclasses.join(' ')
                        });
                    }

                    $(this).find('.sp-x-box').each(function () {

                        var uid = $(this).data('uid');

                        if (!sprint_editor._entries[uid]) {
                            return true;
                        }

                        var blockData = sprint_editor.collectData(uid);

                        var settcnt = 0;
                        var settval = {};
                        var $boxsett = $(this).find('.sp-x-box-settings');
                        $boxsett.find('.sp-x-box-settings-group').each(function () {
                            var name = $(this).data('name');
                            var $val = $(this).find('.sp-active').first();

                            if ($val.length > 0) {
                                settval[name] = $val.data('value');
                                settcnt++;
                            }
                        });

                        if (settcnt > 0) {
                            blockData.settings = settval;
                        } else {
                            delete blockData.settings;
                        }

                        blockData.layout = gindex + ',' + cindex;
                        blocks.push(blockData);
                        index++;

                    });

                });

                if (columns.length > 0) {

                    if (lttitle !== BX.message('SPRINT_EDITOR_lt_default')) {
                        layouts.push({
                            title: lttitle,
                            columns: columns
                        });
                    } else {
                        layouts.push({
                            columns: columns
                        });
                    }

                }

            });

            var resultString = '';

            if (layouts.length > 0) {
                var post = {
                    packname: packname,
                    version: 2,
                    blocks: blocks,
                    layouts: layouts
                };

                resultString = JSON.stringify(post);
                resultString = resultString.replace(/\\n/g, "\\n")
                    .replace(/\\'/g, "\\'")
                    .replace(/\\"/g, '\\"')
                    .replace(/\\&/g, "\\&")
                    .replace(/\\r/g, "\\r")
                    .replace(/\\t/g, "\\t")
                    .replace(/\\b/g, "\\b")
                    .replace(/\\f/g, "\\f");
            }

            return resultString;
        }

    }
};



