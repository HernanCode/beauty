<?php
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('html5', ['style', 'script']);
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'ea-demo',
        get_stylesheet_uri(),
        [],
        wp_get_theme()->get('Version')
    );
    wp_enqueue_style('ea-demo-extra', get_template_directory_uri() . '/extra.css', ['ea-demo'], wp_get_theme()->get('Version'));
});
