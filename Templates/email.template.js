
const emailTemplatee = (data) => {
	return `
	<html style="font: 16px/1 'Open Sans', sans-serif; overflow: auto; padding: 0.5in; background: #999; cursor: default;">

	<head>
		<meta charset="utf-8">
		<title>Invoice</title>
		<style>
			* {
				border: 0;
				box-sizing: content-box;
				color: inherit;
				font-family: inherit;
				font-size: inherit;
				font-style: inherit;
				font-weight: inherit;
				line-height: inherit;
				list-style: none;
				margin: 0;
				padding: 0;
				text-decoration: none;
				vertical-align: top;
			}
	
		</style>
	</head>
	
	<body
		style="box-sizing: border-box; height: 11in; margin: 0 auto; overflow: hidden; padding: 0.5in; width: 8.5in;background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);">
		<header style="margin: 0 0 3em;display: inline-block;width: 100%;">
			<div class="header-top" style="display: inline-block;width: 100%;">
				<div style="float: left;"><img src="https://www.arenesslaw.com/public/assets/images/logo.png" alt=""
						style="max-width: 60px;"></div>
				<div style="float: right;">
					<h3
						style="text-align: right;font-style: normal;font-weight: bold;font-size: 25pt;font-family: DejaVu Serif Condensed;color: #405189;line-height: 20px;border-bottom: 2px solid #405189;padding-bottom: 10px;">
						${data.title}</h3>
					<h4
						style="text-align: right;font-style: normal;font-weight: bold;font-size: 18pt;font-family: DejaVu Serif Condensed;color: #676464;padding: 10px 0px;">
						${data.subtitle}</h4>
				</div>
				<hr style="border-bottom: 1px solid #ccc;display: inline-block;width: 100%;margin-bottom: 1px;">
				<hr style="border-bottom: 1px solid #ccc;display: inline-block;width: 100%;"><br>
			</div>
			<br><br>
			<address
				style="width: 100%;float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0;">
				<p style="float: left;padding-bottom: 10px;margin: 0 0 0.25em;">${data.noticeid}: <strong> ${data.noticeidEg}</strong> </p>
				<p style="float: right;padding-bottom: 10px;margin: 0 0 0.25em;">${data.noticedate} : <strong>
				${data.noticedateEg}</strong></p>
				<p style="display: inline-block;width: 100%;padding-bottom: 10px;margin: 0 0 0.25em;">${data.to}<br>${data.address} </p>
				<p>${data.subject}:${data.subjecttitle}</p>
			</address>
			
		</header>
		<article style="margin: 0 0 3em;font-size: 75%; font-style: normal; line-height: 1.25; ">
			<p style="text-align: center;">${data.ContentInner}</p>
		</article>
		<aside>
			<h1
				style="border-bottom:0px; margin-bottom: 5px;font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase;">
				<span >Additional Notes</span></h1>
			<hr style="border-bottom: 1px solid #ccc;display: inline-block;width: 100%;margin-bottom: 1px;">
			<hr style="border-bottom: 1px solid #ccc;display: inline-block;width: 100%;margin-bottom: 5px;">
			<div style="font-size: 75%; font-style: normal; line-height: 1.25;">
				<p style="text-align: center;font: 12px/1 'Open Sans', sans-serif;">${data.ContentFooter}</p>
			</div>
		</aside>
	</body>
	
	</html>`;
};

export default emailTemplatee;
