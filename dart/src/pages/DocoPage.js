import React from 'react'

//Specified all the Documentation needed to test the functionality of the DART framework
const DocoPage = () => (
    <>
		<h1 className='h1 display-4 text-primary'>DART Documentation</h1>
		<h2 className='text-secondary'>Table of Contents</h2>

		<ul>
			<li><strong><a href="#whatIsDart">What is DART?</a></strong></li>
			<li><strong><a href="#refUseDart">How to use DART</a></strong></li>
		</ul>

		<div id="whatIsDart">
			<h2>What is DART?</h2>
			<p className="text-muted ">
				&nbsp; &nbsp; &nbsp; Data Analysis & Recommendation Tool (DART) is a framework that leverages local compute resources and emerging web technologies to create, train and allow the simple exportation of recommendation machine learning models. 
				You can provide both the data you wish to train on (image or text) and any associated tags for your dataset. DART can then generate a functional model, which in turn will serve data with the desired set of provided tags. 
				If a set of tags are not provided, the functionality is extended to generate a set of appropriate tags that will provide similar results to a tagged datasets. Once the model is generated, it can be retrieved and exported for use in your own framework with your own end-users.
			</p>
			<p className="text-muted ">
				Example use cases for DART:
				<ul>
					<li>You can use DART to train the tool on images of paintings, tagged by their style, artists, etc., and then deploys it to a website. Visitors to the website can upload a painting that they like, and the tool will show them similar paintings, done by the same author, or by other authors with an identical style, paint, era, etc.</li>
					<li>You can use DART to train the tool on the names of cities, tagged by types of tourist activities, relative cost of living, weather profiles, etc., to suggest a vacation destination based on the destination a user inputs.</li>
					<li>You can use DART to train the tool on various foods, tagged by popularity, cuisine, ingredients, etc., to suggest food similar to what the user already likes.</li>
				</ul>
			</p>
		</div>

		<div id="refUseDart">
			<h2>How to use DART</h2>
			<p className="text-muted">
				Please refer to the <a href={"https://drive.google.com/file/d/1aBz2yiE4oRxi8yej9aL4Dmtyk4ZLo6dg/view?usp=sharing"}>PDF</a> for detailed instructions.	 
			</p>
		</div>
    </>
)

export default DocoPage