$('#patient-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/patients?' + search, function(data) {
    $('#blog-posts').html('');
    data.forEach(function(patient) {
      $('#blog-posts').append(`
        <div class="blog col s6 m4 l3" style="padding-bottom:20px">
                    <div class="card small">
                        <div class="card-image waves-effect waves-block waves-light">
                            <a href="/patients/${patient._id}"><img src="${patient.image}" alt="blog-img">
                            </a>
                        </div>
                        <div class="card-content" style="margin-top:10px">
                        <span class="card-title activator grey-text text-darken-4">${patient.name}<i class="mdi-navigation-more-vert right"></i></span>
                        <p>Gender: ${patient.gender}</a>
                        <p>Age: ${patient.age}</a>
                        </p>
                      </div>
                      <div class="card-reveal">
                        <span class="card-title grey-text text-darken-4">Description <i class="mdi-navigation-close right"></i></span>
                        <p>${patient.description}</p>
                      </div>
                    </div>
                </div>
      `);
    });
  });
});

$('#patient-search').submit(function(event) {
  event.preventDefault();
});