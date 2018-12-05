---
layout: plain
title: blog
permalink: blog
---
{% for post in site.posts %}
  <article>
    <h1 class="blog__title"><a href="{{ post.url }}">{{ post.title }}</a></h1>
    {{ post.excerpt }}
    <p><a href="{{ post.url }}">Read more&hellip;</a></p>
  </article>
{% endfor %}
