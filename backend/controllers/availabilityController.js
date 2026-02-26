// backend/controllers/availabilityController.js
import TimeBlock from '../models/TimeBlock.js';

// @desc    Add a new available time block (Auto-sets to 2 hours with overlap check)
// @route   POST /api/availability
// @access  Private (Admin Only)
export const addTimeBlock = async (req, res) => {
  try {
    const { date, startTime } = req.body;
    
    // Auto-calculate the end time (assuming 2-hour default blocks)
    const [hours, minutes] = startTime.split(':');
    const endHours = String(parseInt(hours) + 2).padStart(2, '0');
    const endTime = `${endHours}:${minutes}`;
    
    // OVERLAP CHECK: Find all blocks already scheduled for this exact date
    const existingBlocks = await TimeBlock.find({ date });
    
    const hasOverlap = existingBlocks.some(block => {
      // If the new start time is before the existing end time AND 
      // the new end time is after the existing start time, they overlap.
      return (startTime < block.endTime) && (endTime > block.startTime);
    });

    if (hasOverlap) {
      return res.status(400).json({ message: 'This 2-hour slot overlaps with an existing block.' });
    }
    
    const block = await TimeBlock.create({ 
      date, 
      startTime, 
      endTime 
    });
    
    res.status(201).json(block);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create time block' });
  }
};

// @desc    Get all future available time blocks
// @route   GET /api/availability
// @access  Public
export const getAvailableBlocks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const blocks = await TimeBlock.find({ 
      isBooked: false,
      date: { $gte: today } 
    }).sort({ date: 1, startTime: 1 }); 

    res.json(blocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch availability' });
  }
};

// @desc    Delete a time block
// @route   DELETE /api/availability/:id
// @access  Private (Admin Only)
export const deleteTimeBlock = async (req, res) => {
  try {
    const block = await TimeBlock.findById(req.params.id);
    
    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }
    
    await block.deleteOne();
    res.json({ message: 'Time block removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete block' });
  }
};