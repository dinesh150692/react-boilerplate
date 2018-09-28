cross-env NODE_ENV=production webpack

sed -i "" -e "s|<script type=\"text/javascript\"|<script defer text=\"text/javascript\" |g" build/index.html