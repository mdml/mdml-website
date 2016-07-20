$(document).ready(function(){
    ////////////////////////////////////////////////////////////////////////////
    // Filter publications
    ////////////////////////////////////////////////////////////////////////////
    $('form#publication-filters :checkbox').click(filter_publications);

    function filter_publications(){
        // Get a list of the filters
        var filters = [],
            filteringBy = {year: false, class: false, selected: false};
        $('form#publication-filters :checkbox').each(function(){
            var el = $(this);
            if (el.is(':checked')){
                filters.push({key: el.data('key'), value: el.data('value')});
                filteringBy[el.data('key')] = true;
            }
        });

        // Filter the publications
        $('.publication').show();
        $('.publication').filter(function(){
            var el = $(this),
                visible = {year: !filteringBy.year, class: !filteringBy.class, selected: !filteringBy.selected};

            filters.forEach(function(d){
                if (!d.value) d.value = true;
                visible[d.key] = visible[d.key] || el.data(d.key) == d.value;
            });
            return !(visible.year && visible.class && visible.selected);
        }).hide();
    }

    filter_publications();

    ////////////////////////////////////////////////////////////////////////////
    // Paginate events
    ////////////////////////////////////////////////////////////////////////////
    // Setup
    var events_per_page = 5,
        num_events      = $('dt.event').size(),
        num_pages       = Math.ceil(1. * num_events / events_per_page)
        page_number     = 1;

    // Add pagination
    var event_pagination = d3.select('ul#event-pagination');
    var prev = event_pagination.append('li')
        .attr('class', 'disabled')
        .html('<a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>')
        .on('click', function(){ d3.event.preventDefault(); change_page(page_number - 1); });

    var pages = event_pagination.selectAll('.page')
        .data(d3.range(num_pages)).enter()
        .append('li')
        .attr('class', function(d){ return d == 0 ? 'active' : ''})
        .on('click', change_page);

    pages.append('a').text(function(d){ return d+1; });
    var next = event_pagination.append('li')
        .html('<a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>')
        .on('click', function(){ d3.event.preventDefault(); change_page(page_number + 1); });

    function change_page(d){
        // Update pagination
        var d = d3.max([0, d3.min([d, num_pages-1])]);
        prev.attr('class', d == 0 ? 'disabled' : '');
        next.attr('class', d == (num_pages-1) ? 'disabled' : '');
        $('ul#event-pagination li').removeClass('active');
        $('ul#event-pagination li:eq( ' + (d+1) + ' )').addClass('active'); // add one since the first is the previous button

        // Update the events that are shown
        page_number = d;
        var start   = events_per_page * page_number,
            end     = events_per_page * (page_number+1);

        $('dd.event').each(function(i){
            if (i >= start && i < end) $(this).show();
            else $(this).hide();
        });
        $('dt.event').each(function(i){
            if (i >= start && i < end) $(this).show();
            else $(this).hide();
        });
    }
    change_page(0);
});
