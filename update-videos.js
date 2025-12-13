#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function updateVideos() {
    console.log('🎥 Glory Impact Church - Video Update Helper\n');
    
    try {
        // Read current video data
        const data = JSON.parse(fs.readFileSync('video-data.json', 'utf8'));
        
        console.log('Current Featured Video:', data.featuredSermon.title);
        console.log('Current Recent Videos:', data.recentSermons.map(s => s.title).join(', '));
        console.log('\n');
        
        // Ask what to update
        const updateType = await question('What would you like to update?\n1. Featured Video\n2. Add Recent Video\n3. Replace Recent Video\n4. View Current Videos\nEnter choice (1-4): ');
        
        if (updateType === '1') {
            // Update featured video
            const videoId = await question('Enter YouTube Video ID (e.g., ABC123): ');
            const title = await question('Enter sermon title: ');
            const date = await question('Enter service date/type: ');
            const description = await question('Enter description (optional): ');
            
            data.featuredSermon = {
                videoId: videoId.trim(),
                title: title.trim(),
                date: date.trim(),
                description: description.trim()
            };
            
            console.log('✅ Featured video updated!');
            
        } else if (updateType === '2') {
            // Add recent video
            const videoId = await question('Enter YouTube Video ID (e.g., ABC123): ');
            const title = await question('Enter sermon title: ');
            const date = await question('Enter service date/type: ');
            
            data.recentSermons.unshift({
                videoId: videoId.trim(),
                title: title.trim(),
                date: date.trim(),
                description: ''
            });
            
            // Keep only the 3 most recent
            if (data.recentSermons.length > 3) {
                data.recentSermons = data.recentSermons.slice(0, 3);
            }
            
            console.log('✅ Recent video added!');
            
        } else if (updateType === '3') {
            // Replace recent video
            console.log('\nCurrent recent videos:');
            data.recentSermons.forEach((video, index) => {
                console.log(`${index + 1}. ${video.title}`);
            });
            
            const videoIndex = await question('\nWhich video to replace? (1-3): ');
            const index = parseInt(videoIndex) - 1;
            
            if (index >= 0 && index < data.recentSermons.length) {
                const videoId = await question('Enter new YouTube Video ID (e.g., ABC123): ');
                const title = await question('Enter new sermon title: ');
                const date = await question('Enter new service date/type: ');
                
                data.recentSermons[index] = {
                    videoId: videoId.trim(),
                    title: title.trim(),
                    date: date.trim(),
                    description: ''
                };
                
                console.log('✅ Recent video replaced!');
            } else {
                console.log('❌ Invalid video number');
            }
            
        } else if (updateType === '4') {
            // View current videos
            console.log('\n📺 Current Videos:');
            console.log('\nFeatured Video:');
            console.log(`  Title: ${data.featuredSermon.title}`);
            console.log(`  Video ID: ${data.featuredSermon.videoId}`);
            console.log(`  Date: ${data.featuredSermon.date}`);
            
            console.log('\nRecent Videos:');
            data.recentSermons.forEach((video, index) => {
                console.log(`  ${index + 1}. ${video.title} (${video.videoId})`);
            });
            
            rl.close();
            return;
        } else {
            console.log('❌ Invalid choice');
            rl.close();
            return;
        }
        
        // Save updated data
        fs.writeFileSync('video-data.json', JSON.stringify(data, null, 2));
        console.log('\n🎉 Video data saved successfully!');
        console.log('Your sermons page will automatically update with the new videos.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    rl.close();
}

// Run the script
updateVideos();

