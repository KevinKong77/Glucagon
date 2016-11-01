/*****************************************************************************
 Webtrends
 *****************************************************************************/
function Get_Webtrends_Markup() {
    var str = '';
    str += '<!-- START OF SmartSource Data Collector TAG v10.4.1 -->';
    str += '<!-- Copyright (c) 2012 Webtrends Inc.  All rights reserved. -->';
    str += '<script>';
    str += '    window.webtrendsAsyncInit = function () {';
    str += '        var dcs = new Webtrends.dcs().init({';
    str += '            dcsid: "' + dplVariables.webTrends.dcsid + '",';
    str += '            domain: "statse.webtrendslive.com",';
    str += '            timezone: -5,';
    str += '            i18n: true,';
    str += '            offsite: true,';
    str += '            download: true,';
    str += '            downloadtypes: "xls,doc,ppt,xlsx,docx,pptx,pdf,txt,csv,zip,gzip,tar,swf,wmv,exe,rar",';
    str += '            anchor: true,';
    str += '            javascript: true,';
    str += '            onsitedoms: "' + dplVariables.webTrends.onsitedoms + '",';
    str += '            fpcdom: "' + dplVariables.webTrends.fpcdom + '",';
    str += '            plugins: {';
    str += '                hm: { src: "//s.webtrends.com/js/webtrends.hm.js" }';
    str += '            }';
    str += '        }).track();';
    str += '    };';
    str += '    (function () {var s = document.createElement("script"); s.async = true; s.src = "./webtrends.js";';
	str += ' 	var s2 = document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s, s2);';
    str += '    }());';
    str += '</script>';
    str += '<!-- END OF SmartSource Data Collector TAG v10.4.1 -->';
    str += '<noscript>';
    str += '    <img';
    str += '        alt="dcsimg" ';
    str += '        id="Img1" ';
    str += '        width="1" ';
    str += '        height="1" ';
    str += '        src="//statse.webtrendslive.com/' + dplVariables.webTrends.dcsid + '/njs.gif?dcsuri=/nojavascript&WT.js=No&WT.tv=10.4.1&dcssip=' + dplVariables.webTrends.dcssip + '"';
    str += '    />';
    str += '</noscript>';
    str += '<!-- END OF SmartSource Data Collector TAG v10.4.1 -->';

    return str;
}



// force reload when hash is changed

function hashChange() {

    // only force reload if hash is changed to display a new document

    if ((location.hash.toLowerCase().indexOf("mg") > -1) || (location.hash.toLowerCase().indexOf("ug") > -1) || (location.hash.toLowerCase().indexOf("pi") > -1) || (location.hash.toLowerCase().indexOf("ppi") > -1)) {

        document.location.reload(true);

    }

}


/*****************************************************************************
 DOM Manipulations
 *****************************************************************************/

function closeAccordion(currSection) {
    currSection.find('.accordion-content').slideUp('fast', function() {
        currSection.find('.accordion-header').removeClass('accordion-header-active');
        currSection.find('.accordion-icon').html('+').attr("title", dplVariables.languagePhrases.accordionShow);;
    });
}

function openAccordion(currSection) {
    currSection.find('.accordion-content').slideDown('fast', function() {
        currSection.find('.accordion-header').addClass('accordion-header-active');
        currSection.find('.accordion-icon').html('-').attr("title", dplVariables.languagePhrases.accordionHide);;
    });
}

function closeAllAccordions() {
    $('.accordion-header').each(function() {
        if ($(this).hasClass('accordion-header-active')) {
            closeAccordion($(this).closest('.accordion-section'));
        }
    });
}

function openAllAccordions() {
    $('.accordion-header').each(function() {
        if (!$(this).hasClass('accordion-header-active')) {
            openAccordion($(this).closest('.accordion-section'));
        }
    });
}

function createAccordionSection(sectionId, sectionClass, headerHtml, contentHtml) {
    if ((contentHtml != '') && (contentHtml != undefined)) {
        var sectionStr = '';

        sectionStr += '<div id="' + sectionId + '" class="' + sectionClass + '-content accordion-section">';
        sectionStr += '<div class="accordion-header">';
        sectionStr += headerHtml;
        sectionStr += '</div>';
        sectionStr += '<div class="accordion-content">';
        sectionStr += contentHtml;
        sectionStr += '<p class="hide-link"><a href="#">' + dplVariables.languagePhrases.accordionHide + '</a></p>';
        sectionStr += '</div>';
        sectionStr += '</div>';

        return sectionStr;
    } else {
        return '';
    }
}

function init(hash) {

    var hash = hash,
        headerStr = '',
        warningStr = '',
        highlightsStr = '',
        contentsStr = '',
        piStr = '',
        ppiStr = '',
        mgStr = '',
        ugStr = '',
        footerStr = '',
        warningHeaderStr = '',
        highlightsHeaderStr = '',
        contentsHeaderStr = '',
        mgSection = '42231-1', // Medication Guide
        ugSection = '59845-8', // Instructions for Use
        ppiSection = '42230-3', // Patient Prescribing Information
        displaySection = '51945-4', // Principal Display Panel
        piFooterSection = '42229-5',
        $contentsDiv = $('.Contents:first'),
        $header = $('.DocumentTitle:first'),
        $warning = $contentsDiv.find('.Warning:first'),
        $highlights = $('#Highlights').find('td:eq(1) > div'),
        $index = $('#Index').find('td:eq(1) > div'),
        $pi = $contentsDiv.find('> .Section').not('[data-sectioncode="' + mgSection + '"], [data-sectioncode="' + ugSection + '"], [data-sectioncode="' + ppiSection + '"], [data-sectioncode="' + displaySection + '"]'),
        $piFooter = $contentsDiv.find('> .Section[data-sectioncode="' + piFooterSection + '"]'),
        $mg = $contentsDiv.find('.Section[data-sectioncode="' + mgSection + '"]'),
        $ppi = $contentsDiv.find('.Section[data-sectioncode="' + ppiSection + '"]'),
        $ug = $contentsDiv.find('.Section[data-sectioncode="' + ugSection + '"]'),
        $effectiveDate = $('.EffectiveDate'),
        $distributorName = $('.DistributorName'),
        bodyStr = '';

    /*****************************************************************************
     Create new sections */

    // HEADER
    if ($header.length) {
        headerStr += '<div id="header" class="header-content">';
        headerStr += $header.html();
        headerStr += '</div>';
    }
    headerStr += '<p class="toggle-link"><a href="#" class="view-all">' + dplVariables.languagePhrases.viewAllSections + '</a></p>';

    // BOXED WARNING
    if ($warning.length) {
        warningHeaderStr += '<h1><span class="accordion-icon" title="' + dplVariables.languagePhrases.accordionShow + '">+</span>' + dplVariables.headerOverrides.warning + '</h1>';
        warningHeaderStr += '<span rel="tooltip" class="tooltip" title="' + dplVariables.headerOverrides.warningMessage + '">('+ dplVariables.languagePhrases.hoverWhatIsThis +')</span>';
        warningStr = createAccordionSection('warning', 'warning', warningHeaderStr, '<div class="Warning">' + $warning.html() + '</div>');
    }
    // HIGHLIGHTS OF PRESCRIBING INFORMATION
    if ($highlights.length) {
        highlightsHeaderStr += '<h1><span class="accordion-icon" title="' + dplVariables.languagePhrases.accordionShow + '">+</span>' + $highlights.find('> h1:first').html() + '</h1>'
        highlightsStr = createAccordionSection('highlights', 'highlights', highlightsHeaderStr, $highlights.html());
    }
    // FULL PRESCRIBING INFORMATION: CONTENTS
    if ($index.length) {
        contentsHeaderStr += '<h1><span class="accordion-icon" title="' + dplVariables.languagePhrases.accordionShow + '">+</span>' + $index.find('> h1:first').html() + '</h1>'
        contentsStr = createAccordionSection('contents', 'contents', contentsHeaderStr, $index.html());
    }
    // FULL PRESCRIBING INFORMATION
    if ($pi.length) {

        // append PI footer to Section 17
        if ($piFooter.length) {
            $piFooter.prev().append('<div class="copyright">' + $piFooter.html() + '</div>');
        }

        $pi.each(function(index) {
            var sectionHeader = $(this).find('> h1:first').html(),
                sectionHeaderStr = '',
                sectionContent = $(this).html();

            if (sectionHeader != undefined) {
                sectionHeaderStr = '<h1><span class="accordion-icon" title="' + dplVariables.languagePhrases.accordionShow + '">+</span>' + sectionHeader + '</h1>';
                piStr += createAccordionSection('pi' + index, 'pi', sectionHeaderStr, sectionContent);
            }
        });
    }
    // PATIENT PRESCRIBING INFORMATION
    if ($ppi.length) {
        ppiStr += '<div id="ppi">';
        $ppi.each(function(index) {
            var sectionHeader = $(this).find('> h1:first').html(),
                sectionHeaderStr = '',
                sectionContent = $(this).html();

            if (sectionHeader != undefined) {
                sectionHeaderStr = '<h1><span class="accordion-icon" title="' + dplVariables.languagePhrases.accordionShow + '">+</span>' + sectionHeader.toUpperCase() + '</h1>';
            } else {
                sectionHeaderStr = '<h1><span class="accordion-icon" title="' + dplVariables.languagePhrases.accordionShow + '">+</span>' + dplVariables.headerOverrides.ppi + '</h1>';
            }

            ppiStr += createAccordionSection('ppi' + index, 'ppi', sectionHeaderStr, sectionContent);
        });
        ppiStr += '</div>';
    }
    // MEDICATION GUIDE
    if ($mg.length) {
        mgStr += '<div id="mg">';
        $mg.each(function(index) {
            mgStr += createAccordionSection('mg' + index, 'mg', '<h1><span class="accordion-icon" title="' + dplVariables.languagePhrases.accordionShow + '">+</span>' + dplVariables.headerOverrides.mg + '</h1>', $(this).html());
        });
        mgStr += '</div>';
    }
    // USAGE GUIDE
    if ($ug.length) {
        ugStr += '<div id="ug">';
        $ug.each(function(index) {
            ugStr += createAccordionSection('ug' + index, 'ug', '<h1><span class="accordion-icon" title="' + dplVariables.languagePhrases.accordionShow + '">+</span>' + dplVariables.headerOverrides.ug + '</h1>', $(this).html());
        });
        ugStr += '</div>';
    }
    // FOOTER
    footerStr += '<p class="toggle-link"><a href="#" class="view-all">' + dplVariables.languagePhrases.viewAllSections + '</a></p>';
    footerStr += '<div id="footer" class="footer-content">';
    if ($effectiveDate.length) {

        // remove javascript link wrapper
        $effectiveDate.find('.DocumentMetadata > div:first > a').contents().unwrap();

        footerStr += '<div class="EffectiveDate">';
        footerStr += $('.EffectiveDate').html();
        footerStr += '</div>';
    }
    if ($distributorName.length) {
        footerStr += '<div class="DistributorName">';
        footerStr += $('.DistributorName').html();
        footerStr += '</div>';
    }
    footerStr += '</div>';
    footerStr += '<div class="top-link"><a href="#top"><span title="' + dplVariables.languagePhrases.backToTop + '">back to top</span></a></div>';

    // COMBINED
    bodyStr = headerStr + warningStr + highlightsStr + contentsStr + piStr + mgStr + ppiStr + ugStr + footerStr;

    // replace all content with new string
    $('body').html(bodyStr);

    // remove links from accordion headers
    $('.accordion-header a').contents().unwrap();

    // hide headers in accordion contents
    $('#highlights').find('.accordion-content > h1').hide();
    $('#contents').find('.accordion-content > h1:first').hide();
    $('.pi-content .accordion-content > h1').hide();

    // hide all accordions
    $('.accordion-content').hide();

    // make accordion functional
    $('.accordion-header h1').click(function() {
        if ($(this).closest('.accordion-header').hasClass('accordion-header-active')) {
            closeAccordion($(this).closest('.accordion-section'));
        } else {
            openAccordion($(this).closest('.accordion-section'));
        }
    });
    // link to hide individual accordion sections
    $('.hide-link').click(function(e) {
        closeAccordion($(this).closest('.accordion-section'));
        e.preventDefault();
    });
    // link to toggle all accordion sections
    $('#spl').find('p.toggle-link a').click(function(e) {
        if ($(this).hasClass('view-all')) {
            // open all accordions
            openAllAccordions();
            $('#spl').find('.toggle-link a').html(dplVariables.languagePhrases.closeAllSections).removeClass('view-all').addClass('close-all');
        } else if ($(this).hasClass('close-all')) {
            closeAllAccordions();
            $('#spl').find('.toggle-link a').html(dplVariables.languagePhrases.viewAllSections).removeClass('close-all').addClass('view-all');
        }
        e.preventDefault();
    });
    // show warning section on load
    if ($('#warning').html() != '') {
        openAccordion($('#warning'));
    }
    /*****************************************************************************
     Handle anchor links */
    $('a[href^="#"]').not('[href="#"], [href="#top"]').click(function(e) {

        var hashStr = $(this).attr('href').replace('#', ''), 
            $currSectionHeader = $(this).closest('.accordion-section').children('.accordion-header'); // header of section containing the link the user clicked
            $hashTarget = $('a[name="' + hashStr + '"]'); // target anchor

        if ($hashTarget.length) {
            // close all accordions except the one containing the link the use clicked
            $('.accordion-header').not($currSectionHeader).each(function() {
                if ($(this).hasClass('accordion-header-active')) {
                    closeAccordion($(this).closest('.accordion-section'));
                }
            });
            openAccordion($hashTarget.closest('.accordion-section'));
            setTimeout(function() {
                $('html, body').animate({
                    scrollTop: $($hashTarget).offset().top
                }, 500);
            }, 250);
            location.hash = '#' + hashStr;
        }
        e.preventDefault();
    });
    /*****************************************************************************
     Handle hashes at the end of the URL */
    var $hashSection;
    if ((hash == 'ppi') || (hash == 'mg') || (hash == 'ug')) {
        $hashSection = $('#' + hash);
        if ($hashSection.length) {
            openAccordion($hashSection);
            setTimeout(function() {
                $('html, body').animate({
                    scrollTop: $($('#' + hash)).offset().top
                }, 500);
            }, 250);
        }
    } else if (hash == 'pi') {
        $hashSection = $('#highlights');
        if ($hashSection.length) {
            openAccordion($hashSection);
            setTimeout(function() {
                $('html, body').animate({
                    scrollTop: $($('#highlights')).offset().top
                }, 500);
            }, 250);
        }
    } else if (hash != '') {
        $hashSection = $('a[name="' + hash + '"]');
        if ($hashSection.length) {
            openAccordion($hashSection.closest('.accordion-section'));
            setTimeout(function() {
                $('html, body').animate({
                    scrollTop: $($hashSection).offset().top
                }, 500);
            }, 250);
        } else {
            window.scrollTo(0, 0)
        }
    } else {
        window.scrollTo(0, 0);
    }
}
$(function() { // ready
    // get page hashtag
    var hash = location.hash.replace('#', '').toLowerCase();
    init(hash);
    // webtrends
    $("body").append(Get_Webtrends_Markup);
    // hash has changed
    window.onhashchange = hashChange;
    /*****************************************************************************
     * CUSTOM TOOLTIP
     * http://osvaldas.info/elegant-css-and-jquery-tooltip-responsive-mobile-friendly
     *****************************************************************************/
    $(function() {
        var targets = $('[rel~=tooltip]'),
            target = false,
            tooltip = false,
            title = false;
        targets.bind('mouseenter', function() {
            target = $(this);
            tip = target.attr('title');
            tooltip = $('<div id="tooltip"></div>');
            if (!tip || tip == '')
                return false;
            target.removeAttr('title');
            tooltip.css('opacity', 0).html(tip).appendTo('body');
            var init_tooltip = function() {
                if ($(window).width() < tooltip.outerWidth() * 1.5)
                    tooltip.css('max-width', $(window).width() / 2);
                else
                    tooltip.css('max-width', 340);
                var pos_left = target.offset().left + (target.outerWidth() / 2) - (tooltip.outerWidth() / 2),
                    pos_top = target.offset().top - tooltip.outerHeight() - 20;
                if (pos_left < 0) {
                    pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                    tooltip.addClass('left');
                } else
                    tooltip.removeClass('left');
                if (pos_left + tooltip.outerWidth() > $(window).width()) {
                    pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                    tooltip.addClass('right');
                } else
                    tooltip.removeClass('right');
                if (pos_top < 0) {
                    var pos_top = target.offset().top + target.outerHeight();
                    tooltip.addClass('top');
                } else
                    tooltip.removeClass('top');
                tooltip.css({
                    left: pos_left,
                    top: pos_top
                }).animate({
                    top: '+=10',
                    opacity: 1
                }, 50);
            };
            init_tooltip();
            $(window).resize(init_tooltip);
            var remove_tooltip = function() {
                tooltip.animate({
                    top: '-=10',
                    opacity: 0
                }, 50, function() {
                    $(this).remove();
                });
                target.attr('title', tip);
            };
            target.bind('mouseleave', remove_tooltip);
            tooltip.bind('click', remove_tooltip);
        });
    });
});
