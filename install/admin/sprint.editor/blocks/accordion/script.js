sprint_editor.registerBlock('accordion', function ($, $el, data, settings, currentEditorParams) {

    settings = settings || {};
    currentEditorParams = currentEditorParams || {};

    data = $.extend({
        items: [],
    }, data);

    var blocklist = [
        {id: 'htag', title: 'заголовок'},
        {id: 'text', title: 'текст'},
        {id: 'image', title: 'картинку'},
        {id: 'video', title: 'видео'},
        {id: 'lists', title: 'список'},
    ];

    if (settings.blocks && settings.blocks.value) {
        blocklist = [];
        $.each(settings.blocks.value, function (index, val) {
            blocklist.push({id: index, title: val})
        });
    }

    this.getData = function () {
        return data;
    };

    this.collectData = function () {
        data.items = [];

        var $container = $el.children('.sp-acc-container');

        $container.children('.sp-acc-tab').each(function () {
            var $tabblocks = $(this).children('.sp-acc-tab-blocks');
            var $tabBtn1 = $(this).children('.sp-acc-buttons1')

            var tab = {
                title: $tabBtn1.children('.sp-acc-tab-value').val(),
                blocks: []
            };

            $tabblocks.children('.sp-x-box').each(function () {
                var blockData = sprint_editor.collectData(
                    $(this).data('uid')
                );

                blockData.settings = sprint_editor.collectSettings(
                    $(this).children('.sp-x-box-settings')
                );

                tab.blocks.push(blockData);
            });

            data.items.push(tab);

        });
        return data;
    };

    this.afterRender = function () {
        var $container = $el.children('.sp-acc-container');

        $.each(data.items, function (index, item) {
            addTab(item, false);
        });

        sprint_editor.listenEvent('clipboard:check', function () {
            let clipboardData = sprint_editor.getClipboard();

            if (!$.isEmptyObject(clipboardData)) {
                $el.find('.sp-acc-paste').show();
            } else {
                $el.find('.sp-acc-paste').hide();
            }
        });

        $container.sortable({
            items: "> div",
            handle: ".sp-acc-tab-handle",
        });

        $el.on('click', '.sp-acc-add-tab', function (e) {
            addTab({
                title: '',
                blocks: []
            }, true);
        });

         $el.on('click', '.sp-acc-buttons1', function (event) {
            if ($(event.target).hasClass('sp-acc-buttons1')) {
                var $tab = $(event.target).closest('.sp-acc-tab');

                showTab($tab)

                sprint_editor.fireEvent('popup:hide');
            }
        });

        $el.on('click', '.sp-acc-tab-handle', function (event) {
            var $tab = $(event.target).closest('.sp-acc-tab');

            showTab($tab)

            sprint_editor.fireEvent('popup:hide');
        });

        $el.on('click', '.sp-acc-box-add', function () {
            var $tabblocks = $(this).closest('.sp-acc-tab').children('.sp-acc-tab-blocks');
            addblock(
                {
                    name: $(this).data('name')
                },
                $tabblocks
            );
        });

        $el.on('click', '.sp-acc-paste', function (event) {
            event.preventDefault();

            let clipboardData = sprint_editor.getClipboard();
            var $tabblocks = $(this).closest('.sp-acc-tab').children('.sp-acc-tab-blocks');

            $.each(clipboardData, function (blockUid, blockData) {
                addblock(blockData.block, $tabblocks);
            });

            sprint_editor.fireEvent('clipboard:paste');
            sprint_editor.clearClipboard();
        });

        $el.on('click', '.sp-acc-copy', function (e) {
            e.preventDefault();
            var $tabblocks = $(this).closest('.sp-acc-tab').children('.sp-acc-tab-blocks');

            $tabblocks.find('.sp-x-box').each(function () {
                sprint_editor.copyToClipboard($(this).data('uid'), false);
            });
        });

        $el.on('click', '.sp-acc-cut', function (e) {
            e.preventDefault();
            var $tabblocks = $(this).closest('.sp-acc-tab').children('.sp-acc-tab-blocks');

            $tabblocks.find('.sp-x-box').each(function () {
                sprint_editor.copyToClipboard($(this).data('uid'), true);
            });
        });

        $el.on('click', '.sp-acc-del', function (e) {
            e.preventDefault();
            var $target = $(this).closest('.sp-acc-tab');

            $target.hide(250, function () {
                $target.remove();
            });
        });
        $el.on('click', '.sp-acc-up', function (e) {
            e.preventDefault();
            var $block = $(this).closest('.sp-acc-tab');
            var $nblock = $block.prev('.sp-acc-tab');
            if ($nblock.length > 0) {
                $block.insertBefore($nblock);
            }
        });
        $el.on('click', '.sp-acc-dn', function (e) {
            e.preventDefault();
            var $block = $(this).closest('.sp-acc-tab');
            var $nblock = $block.next('.sp-acc-tab');
            if ($nblock.length > 0) {
                $block.insertAfter($nblock);
            }
        });

        $el.on('click', '.sp-acc-box-del', function (e) {
            e.preventDefault();
            var $target = $(this).closest('.sp-x-box');

            var uid = $target.data('uid');
            sprint_editor.beforeDelete(uid);

            $target.hide(250, function () {
                $target.remove();
            });
        });
        $el.on('click', '.sp-acc-box-up', function (e) {
            e.preventDefault();

            var $block = $(this).closest('.sp-x-box');

            var $nblock = $block.prev('.sp-x-box');
            if ($nblock.length > 0) {
                $block.insertBefore($nblock);
                sprint_editor.afterSort($block.data('uid'));
            }
        });
        $el.on('click', '.sp-acc-box-dn', function (e) {
            e.preventDefault();

            var $block = $(this).closest('.sp-x-box');

            var $nblock = $block.next('.sp-x-box');
            if ($nblock.length > 0) {
                $block.insertAfter($nblock);
                sprint_editor.afterSort(
                    $block.data('uid')
                );
            }
        });

        function addTab(tabData, show) {
            var $tab = $(sprint_editor.renderTemplate('accordion-tab', {
                title: tabData.title,
                blocklist: blocklist
            }));

            $container.append($tab);

            if (show) {
                showTab($tab)
            }

            var $tabblocks = $tab.children('.sp-acc-tab-blocks');

            $.each(tabData.blocks, function (index, blockData) {
                addblock(blockData, $tabblocks)
            });

            $tabblocks.sortable({
                items: "> div",
                handle: ".sp-acc-box-handle",
                connectWith: ".sp-acc-tab-blocks",
            });
        }

        function showTab($tab) {
            var $tabblocks = $tab.children('.sp-acc-tab-blocks');
            var $tabbtns2 = $tab.children('.sp-acc-buttons2');

            $el.find('.sp-acc-tab-blocks').not($tabblocks).hide(250);
            $el.find('.sp-acc-buttons2').not($tabbtns2).hide(250);

            $tabblocks.show(250);
            $tabbtns2.show(250);

        }

        function enabledblock(name) {
            var index = blocklist.findIndex(function (val) {
                return val.id === name;
            })

            return (index >= 0);
        }

        function addblock(blockData, $tabblocks) {
            if (!enabledblock(blockData.name)) {
                return;
            }

            var uid = sprint_editor.makeUid('sp-acc');
            var blockSettings = sprint_editor.getBlockSettings(blockData.name, currentEditorParams);

            var $box = $(sprint_editor.renderTemplate('accordion-box', {
                uid: uid,
                title: sprint_editor.getBlockTitle(blockData.name),
                compiled: sprint_editor.compileSettings(blockData, blockSettings)
            }));

            $box.hide();

            $tabblocks.append($box);

            $box.show(250);

            var $elBlock = $box.children('.sp-x-box-block');
            var elEntry = sprint_editor.initblock(
                $,
                $elBlock,
                blockData.name,
                blockData,
                blockSettings,
                currentEditorParams
            );

            sprint_editor.initblockAreas(
                $,
                $elBlock,
                elEntry,
                currentEditorParams
            );
            sprint_editor.registerEntry(uid, elEntry);
        }
    };
});
