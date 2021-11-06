<?php
/* Template Name: Modular */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
Timber::render( 'modular.twig', $context );
