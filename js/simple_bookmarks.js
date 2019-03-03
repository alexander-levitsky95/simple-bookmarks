(function ($, Drupal) {

  function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
      updatedCookie += "; " + propName;
      var propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += "=" + propValue;
      }
    }

    document.cookie = updatedCookie;
  }

  function deleteCookie(name) {
    setCookie(name, "", {
      'expires': -1,
      'domain': document.location.hostname,
      'path': '/'
    })
  }

  Drupal.behaviors.simpleBookmarksBehavior = {
    attach: function (context, settings) {

      const $bookmark = $(document).find('.flag-flag');

      $bookmark.each(function (key, item) {
        $(item).addClass('action-flag');
        if (getCookie('visitor_bookmark_node_id')) {
          $cookies = $.parseJSON(getCookie("visitor_bookmark_node_id"));
          for (elem in $cookies) {
            if ($cookies[elem].node_id == $(item).attr('node-id')) {
              $(item).removeClass("action-flag");
              $(item).addClass('action-unflag');
            }
          }
        }
      });

      const $link_flag = $bookmark.find('a');

      $link_flag.each(function (kye, item) {
        $(item).unbind().click(function(e) {
          e.preventDefault();

          const $visitor_bookmark_node_id=[];
          const cookie_date = new Date();
          cookie_date.setMonth(cookie_date.getMonth() + 12);

          const $cookie_options = {
            'expires': cookie_date,
            'domain': document.location.hostname,
            'path': '/'
          };

          if ($(item).parent().hasClass('action-flag')) {
            $(item).parent().removeClass("action-flag");
            $(item).parent().addClass("action-unflag");

            if (getCookie("visitor_bookmark_node_id")) {
              $cookies = $.parseJSON(getCookie("visitor_bookmark_node_id"));
              for (elem in $cookies) {
                $visitor_bookmark_node_id.push($cookies[elem]);
              }
              for (var i = 0; i < $visitor_bookmark_node_id.length; i++) {
                if ($visitor_bookmark_node_id[i].node_id != $(item).parent().attr('node-id')) {
                  $visitor_bookmark_node_id.push(
                    {'node_id': $(item).parent().attr('node-id')}
                  );
                }
              }
            } else {
              $visitor_bookmark_node_id.push(
                {'node_id': $(item).parent().attr('node-id')}
              );
            }

            const unique = [];

            for (var j = 0; j < $visitor_bookmark_node_id.length; j++) {
              if (unique.indexOf($visitor_bookmark_node_id[j].node_id) >= 0) {
                $visitor_bookmark_node_id.splice(j, 1);
                j--;
              } else {
                unique.push($visitor_bookmark_node_id[j].node_id);
              }
            }

            setCookie('visitor_bookmark_node_id', JSON.stringify($visitor_bookmark_node_id), $cookie_options);

          } else {
            $(item).parent().removeClass("action-unflag");
            $(item).parent().addClass('action-flag');
            
            $cookies = $.parseJSON(getCookie("visitor_bookmark_node_id"));
            for (elem in $cookies) {
              $visitor_bookmark_node_id.push($cookies[elem]);
            }
            for (var ii = 0; ii < $visitor_bookmark_node_id.length; ii++) {
              if ($visitor_bookmark_node_id[ii].node_id == $(item).parent().attr('node-id')) {
                $visitor_bookmark_node_id.splice(ii, 1);
                ii--;
              }
            }
            if ($visitor_bookmark_node_id.length == 0) {
              deleteCookie('visitor_bookmark_node_id');
            } else {
              setCookie('visitor_bookmark_node_id', JSON.stringify($visitor_bookmark_node_id), $cookie_options);
            }
          }
        });
      });
    }
  };
})(jQuery, Drupal);
