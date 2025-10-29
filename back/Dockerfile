FROM php:8.3-apache

RUN a2enmod rewrite
COPY apache2.conf /etc/apache2/apache2.conf

COPY ./ ./

RUN apt-get update

RUN apt-get install -y libssl-dev

RUN apt-get install -y unzip libzip-dev
RUN docker-php-ext-install zip

RUN apt-get install -y git

RUN pecl install mongodb
RUN docker-php-ext-enable mongodb

RUN curl -sS https://getcomposer.org/installer -o composer-setup.php
RUN php composer-setup.php --install-dir=/usr/local/bin --filename=composer

RUN composer dump-autoload
RUN composer install