FROM php:8.2-apache

LABEL maintainer="birazn"

RUN apt update && apt install -y git \
    && docker-php-ext-install json 2>/dev/null || true

# Habilita mod_rewrite para API REST
RUN a2enmod rewrite

# Configura AllowOverride para .htaccess funcionar
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

WORKDIR /var/www/html

COPY src/. ./

# Garante permissão de escrita no arquivo de dados
RUN chmod 777 /var/www/html/data 2>/dev/null || mkdir -p /var/www/html/data && chmod 777 /var/www/html/data

EXPOSE 80

CMD ["apache2ctl", "-D", "FOREGROUND"]
