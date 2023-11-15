<?php
require_once __DIR__ . "/../lib/locale.php";

Sprint\Editor\Locale::loadLocale([
    "SPRINT_EDITOR_MODULE_NAME"                => "Редактор для контент-менеджеров",
    "SPRINT_EDITOR_MODULE_DESCRIPTION"         => "Инструменты для наполнения контента",
    "SPRINT_EDITOR_PARTNER_NAME"               => "Андрей Рябин",
    "SPRINT_EDITOR_PARTNER_URI"                => "http://dev.1c-bitrix.ru/community/webdev/user/39653/blog/",
    "SPRINT_EDITOR_TITLE"                      => "Редактор блоков (sprint.editor)",
    "SPRINT_EDITOR_LOAD_JQUERY_UI"             => "Подключить jquery ui *",
    "SPRINT_EDITOR_LOAD_DOTJS"                 => "Подключить шаблонизатор doT *",
    "SPRINT_EDITOR_INSTAGRAM_APP_ID"           => "ID приложения facebook для подгрузки instagram постов",
    "SPRINT_EDITOR_INSTAGRAM_APP_SECRET"       => "Секрет приложения facebook для подгрузки instagram постов",
    "SPRINT_EDITOR_BTN_ACTIONS"                => "Действия",
    "SPRINT_EDITOR_BTN_SAVE"                   => "Сохранить",
    "SPRINT_EDITOR_BTN_PASTE"                  => "Вставить",
    "SPRINT_EDITOR_BTN_EXECUTE"                => "Выполнить",
    "SPRINT_EDITOR_BTN_CHECK"                  => "Проверить",
    "SPRINT_EDITOR_LONG_TEXT_DESC"             => "Увеличить размер колонки в бд до longtext \n Инфоблоки с редактором должны хранить свойства в отдельной таблице",
    "SPRINT_EDITOR_LONG_TEXT_PROPS_NOT_FOUND"  => "Не найдены свойства с редактором доступные для обновления",
    "SPRINT_EDITOR_LONG_TEXT_PROP_FOUND"       => "Найдено свойство #PROP_NAME# в инфоблоке #IBLOCK_NAME#",
    "SPRINT_EDITOR_LONG_TEXT_PROP_UPDATED"     => "Найдено свойств: #COUNT#, Обновлено: #UPDATED#",
    "SPRINT_EDITOR_LONG_TEXT_IBLOCK_LINK_ELEM" => "Инфоблок",
    "SPRINT_EDITOR_LONG_TEXT_IBLOCK_LINK_SETT" => "Настройки",
    "SPRINT_EDITOR_UPGRADES"                   => "Обновления",
    "SPRINT_EDITOR_TASKS"                      => "Инструменты",
    "SPRINT_EDITOR_SELECT_EMPTY"               => "Блоки не найдены",
    "SPRINT_EDITOR_OPTIONS_LINK"               => "Настройки модуля",
    "SPRINT_EDITOR_HELP"                       => "Помощь",
    "SPRINT_EDITOR_HELP_WIKI"                  => "Документация",
    "SPRINT_EDITOR_HELP_TRACKER"               => "Форма для вопросов и предложений ",
    "SPRINT_EDITOR_HELP_MARKETPLACE"           => "Страничка модуля в маркетплейсе",
    "SPRINT_EDITOR_HELP_DONATE"                => "Поддержать разработку",
    "SPRINT_EDITOR_HELP_TELEGRAM"              => "Группа в телеграме",
    "SPRINT_EDITOR_SETTINGS_DISABLE_CHANGE"    => "Отключить добавление блоков",
    "SPRINT_EDITOR_SETTINGS_WIDE_MODE"         => "Развернуть редактор на всю ширину",
    "SPRINT_EDITOR_SETTINGS_DISABLE_PACKS"     => "Отключить работу с макетами",
    "SPRINT_EDITOR_SETTINGS_SETTINGS_NAME"     => "Пользовательские настройки блоков",
    "SPRINT_EDITOR_SETTINGS_DEFAULT_VALUE"     => "Значение по умолчанию",
    "SPRINT_EDITOR_SETTINGS_NAME_NO"           => "Простой редактор",
    "SPRINT_EDITOR_PACKS_PAGE"                 => "Конструктор макетов",
    "SPRINT_EDITOR_COMPLEX_BUILDER"            => "Конструктор блоков",
    "SPRINT_EDITOR_TRASH_FILES"                => "Поиск удалённых изображений",
    "SPRINT_EDITOR_group_layout"               => "Добавить сетку",
    "SPRINT_EDITOR_group_packs"                => "Добавить макет",
    "SPRINT_EDITOR_group_blocks"               => "Добавить блоки",
    "SPRINT_EDITOR_add"                        => "Добавить",
    "SPRINT_EDITOR_add_block"                  => "Добавить блок",
    "SPRINT_EDITOR_group_my"                   => "Пользовательские",
    "SPRINT_EDITOR_group_complex"              => "Составные",

    "SPRINT_EDITOR_layout_type1"  => "Простая сетка",
    "SPRINT_EDITOR_layout_type2"  => "Сетка из 2 колонок",
    "SPRINT_EDITOR_layout_type3"  => "Сетка из 3 колонок",
    "SPRINT_EDITOR_layout_type4"  => "Сетка из 4 колонок",
    "SPRINT_EDITOR_layout_toggle" => "Переключить отображение колонок",

    "SPRINT_EDITOR_pack_save_content" => "Сохранить как макет",
    "SPRINT_EDITOR_pack_save_title"   => "Сохранить контент редактора в макет",
    "SPRINT_EDITOR_pack_del"          => "Удалить макет",

    "SPRINT_EDITOR_new_pack"           => "Новый макет",
    "SPRINT_EDITOR_field_packs"        => "Макеты",
    "SPRINT_EDITOR_pack_user_settings" => "Пользовательские настройки",
    "SPRINT_EDITOR_pack_open"          => "Открыть",
    "SPRINT_EDITOR_pack_id"            => "Название макета",
    "SPRINT_EDITOR_pack_title"         => "Заголовок",
    "SPRINT_EDITOR_pack_save"          => "Сохранить макет",
    "SPRINT_EDITOR_pack_delete"        => "Удалить макет",

    "SPRINT_EDITOR_pack_err_name"   => "Укажите название макета",
    "SPRINT_EDITOR_pack_err_title"  => "Укажите заголовок макета",
    "SPRINT_EDITOR_pack_err_exists" => "Такой макет уже есть",
    "SPRINT_EDITOR_pack_err_build"  => "Задайте содержимое макета",

    "SPRINT_EDITOR_new_block"     => "Новый блок",
    "SPRINT_EDITOR_block_id"      => "Название блока",
    "SPRINT_EDITOR_block_title"   => "Заголовок",
    "SPRINT_EDITOR_block_sort"    => "Сортировка",
    "SPRINT_EDITOR_complex_block" => "Составной блок",
    "SPRINT_EDITOR_block_save"    => "Сохранить блок",
    "SPRINT_EDITOR_block_delete"  => "Удалить блок",

    "SPRINT_EDITOR_complex_err_exists" => "Такой блок уже есть",
    "SPRINT_EDITOR_complex_err_name"   => "Укажите название блока",
    "SPRINT_EDITOR_complex_err_build"  => "Задайте содержимое блока",
    "SPRINT_EDITOR_complex_err_title"  => "Укажите заголовок блока",

    "SPRINT_EDITOR_lt_change"   => "Укажите название сетки",
    "SPRINT_EDITOR_col_change"  => "Укажите название колонки",
    "SPRINT_EDITOR_lt_default"  => "Сетка",
    "SPRINT_EDITOR_col_default" => "Колонка",

    "SPRINT_EDITOR_USED_IBLOCKS"  => "Инфоблоки с редактором",
    "SPRINT_EDITOR_USED_ENTITIES" => "Пользовательские поля",

    "SPRINT_EDITOR_block_contents_title" => "Содержание:",
]);
