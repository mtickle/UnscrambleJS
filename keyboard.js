$(function(){
	var $write = $('#write'),
		shift = false,
		capslock = false;
	
	$('#keyboard li').click(function(){
		var $this = $(this),
        character = $this.html();
        //$this.off("click");
        $this.addClass("deaditem");        
		$write.html($write.html() + character);
	});
});


