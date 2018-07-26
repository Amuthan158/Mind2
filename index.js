var AbstractionLayer = MindFusion.AbstractionLayer;
var GraphicsUnit = MindFusion.Drawing.GraphicsUnit
var mdiag=MindFusion.Diagramming;
var AnchorPattern = MindFusion.Diagramming.AnchorPattern;
var AnchorPoint = MindFusion.Diagramming.AnchorPoint;
var DiagramNode = MindFusion.Diagramming.DiagramNode;
var DiagramLink = MindFusion.Diagramming.DiagramLink;
var ShapeNode = MindFusion.Diagramming.ShapeNode;
var MarkStyle = MindFusion.Diagramming.MarkStyle;
var Style = MindFusion.Diagramming.Style;
var Theme = MindFusion.Diagramming.Theme;
var FontStyle = MindFusion.Drawing.FontStyle;
var Alignment = MindFusion.Diagramming.Alignment;
var Behavior = MindFusion.Diagramming.Behavior;
var HandlesStyle = MindFusion.Diagramming.HandlesStyle;
var ChangeItemCommand = MindFusion.Diagramming.ChangeItemCommand;
var Events = MindFusion.Diagramming.Events;
var Diagram = MindFusion.Diagramming.Diagram;
var Overview = MindFusion.Diagramming.Overview;
var NodeListView = MindFusion.Diagramming.NodeListView;
var Rect = MindFusion.Drawing.Rect;
var Shape = MindFusion.Diagramming.Shape;
var Export=MindFusion.Diagramming.SvgExporter;
var FitSize=MindFusion.Diagramming.FitSize;
var ArrayList = MindFusion.Collections.ArrayList;
var nodetext="";
var taskList=[];
var activeElement={};
var data={'diagram':null,'diagramdetail':[]};
var diagram, overview, nodeList, anchorPattern, listFileNames;
    var AeroEffect = MindFusion.Diagramming.AeroEffect;
var GlassEffect = MindFusion.Diagramming.GlassEffect;
var GlassEffectType = MindFusion.Diagramming.GlassEffectType;
var ContainerNode=MindFusion.Diagramming.ContainerNode;
var Line = MindFusion.Drawing.Line;
var Point = MindFusion.Drawing.Point;

var Font = MindFusion.Drawing.Font;
var EffectPhase = MindFusion.Diagramming.EffectPhase;
var Utils = MindFusion.Diagramming.Utils;



DiagramLink.prototype.updateText = function ()
{
  if (!this.parent) {
    return
  }
  var mgeo = MindFusion.Geometry;
  this.textRenderer.clearLayout();
  this.textSize = this.parent.measureString(this.text, this.getEffectiveFont());
  var segmentCount = this.getSegmentCount();
  this.textRenderer.textAlignment = Alignment.Near;
  this.textRenderer.lineAlignment = Alignment.Near;
  var poly = ArrayList.clone(this.points);
  var start = 0;
  var textHeight = this.textSize.height;
  var startPoint = poly[0];
  var origin=this.origin.bounds;
  this.textRenderer.strings.push(this.text);
  this.textRenderer.angles.push(0);
    if (poly[0].x==origin.x) {
        this.textRenderer.rectangles.push(new Rect(poly[0].x-(this.textSize.width+2), poly[0].y+2, this.textSize.width, this.textSize.height));
    }else if(poly[0].y==origin.y) {
        this.textRenderer.rectangles.push(new Rect(poly[0].x+2, poly[0].y-(this.textSize.height+2), this.textSize.width, this.textSize.height));
     }else
    {
    this.textRenderer.rectangles.push(new Rect(poly[0].x+2, poly[0].y+2, this.textSize.width, this.textSize.height));
  }
};


(function(mdiag) {
  var GraphicsUnit = MindFusion.Drawing.GraphicsUnit;
  var Rect = MindFusion.Drawing.Rect;
  var Ellipse = MindFusion.Drawing.Ellipse;
  var Line = MindFusion.Drawing.Line;
  var Folder = mdiag.Folder = function(node) {
    mflayer.initializeBase(Folder, this, [node]);
    this.updateContent();
    this.updateLocation()
  };
  Folder.prototype = {
    updateLocation: function() {
      var iconRect = this.getRect();
      this.x = iconRect.x;
      this.y = iconRect.y;

    },
    drawMinus: function(rect, mm) {
      rect.brush = "white";
      this.content = [rect];
      var y = rect.y + rect.height / 2;
      var line = new MindFusion.Drawing.Line(rect.x + mm, y, rect.right() - mm, y);
      this.content.push(line)
    },
    drawPlus: function(rect, mm) {
      this.drawMinus(rect, mm);
      var x = rect.x + rect.width / 2;
      var line = new MindFusion.Drawing.Line(x, rect.y + mm, x, rect.bottom() - mm);
      this.content.push(line)
    },
    onClick: function(mousePosition) {
      if (!this.hitTest(mousePosition)) {
        return
      }
      var node = this.node;
      if (node.parent.getUndoEnabled()) {
        node.parent.undoManager.startComposite();
        node.parent.undoManager.executeCommand(new mdiag.FoldContainerCommand(this, node));
        node.parent.undoManager.endComposite()
      } else {
        node.setFolded(!node.getFolded())
      }
      if (node.getFolded()) {
        node.raiseFolded(node)
      } else {
        node.raiseUnfolded(node)
      }
    },
    hitTest: function(mousePosition) {
      return this.getRotatedRect().containsPoint(mousePosition);
    },
    getRect: function() {
      var node = this.node;
      var mm = GraphicsUnit.getMillimeter(node.parent.measureUnit);
      var diameter = 4;

      var padding = mm;
      if (padding > diameter / 4) {
        padding = diameter / 4
      }
      var rect = node.bounds.clone();
      rect.height = diameter;
      rect.x = rect.right() - diameter;
      rect.width = diameter;
    //  rect = rect.inflate(-padding, -padding);
      return rect
    },
    getRotatedRect: function() {
      var rect = this.getRect();
      if (this.node.rotationAngle != 0) {
        var p = [];
        p.push(rect.topLeft());
        p.push(rect.topRight());
        p.push(rect.bottomRight());
        p.push(rect.bottomLeft());
        mdiag.Utils.rotatePointsAt(p, mdiag.Utils.getCenter(this.node.bounds), this.node.rotationAngle);
        var minX = Math.min(p[0].x, Math.min(p[1].x, Math.min(p[2].x, p[3].x)));
        var minY = Math.min(p[0].y, Math.min(p[1].y, Math.min(p[2].y, p[3].y)));
        var maxX = Math.max(p[0].x, Math.max(p[1].x, Math.max(p[2].x, p[3].x)));
        var maxY = Math.max(p[0].y, Math.max(p[1].y, Math.max(p[2].y, p[3].y)));
        return Rect.fromLTRB(minX, minY, maxX, maxY)
      }
      return rect
    },
    getOutline: function() {
      var rect = this.getRect();
      var p = [];
      p.push(rect.topLeft());
      p.push(rect.topRight());
      p.push(rect.bottomRight());
      p.push(rect.bottomLeft());
      mdiag.Utils.rotatePointsAt(p, mdiag.Utils.getCenter(this.node.bounds), this.node.rotationAngle);
      return p
    },
    updateContent: function() {
      var mm = GraphicsUnit.getMillimeter(this.node.parent.measureUnit);
      var rect = this.getRect();
      rect.x = rect.y = 0;
      if (this.node.folded) {
        this.drawPlus(rect, mm)
      } else {
        this.drawMinus(rect, mm)
      }
    }
  };
  MindFusion.registerClass(Folder, "MindFusion.Diagramming.Folder", mdiag.Manipulator)
})(MindFusion.Diagramming);
ContainerNode.prototype.setEnableStyledText = function (value)
{
	 if (this.text.enableStyledText != value)
        {
                this.text.enableStyledText = value;
                this.invalidate();
        }
};
ContainerNode.prototype.setFoldable=function(value) {
  var foldable = this.getFoldable();
  if (foldable == value) {
    return
  }
  if (value) {
    this.folder = new mdiag.Folder(this);
    this.addManipulator(this.folder)
  } else {
    this.removeManipulator(this.folder);
    delete this.folder
  }
  this.invalidate()
};

ContainerNode.prototype.fromJson=function(json) {
  mflayer.callBaseMethod(ContainerNode, this, "fromJson", [json]);
  this.captionHeight = json.captionHeight;
  this.captionBackBrush = json.captionBackBrush;
  this.allowAddChildren = json.allowAddChildren;
  this.allowRemoveChildren = json.allowRemoveChildren;
  this.margin = json.margin;
  if (json.clipChildren != undefined) {
    this.clipChildren = json.clipChildren
  }
  if (json.foldIconSize != undefined) {
    this.foldIconSize = json.foldIconSize
  }
  this.setFoldable(json.foldable);
  this.setFolded(json.folded);
  this.resizeFitText(FitSize.KeepRatio);
  if (json.folded) {
    this.setBounds(new Rect(json.bounds.x, json.bounds.y, json.bounds.width, json.bounds.height))
  }
  if (json.unfoldedSize) {
    this.unfoldedSize = MindFusion.Drawing.Size.copy(json.unfoldedSize)
  }
  if (json.shape) {
    this.setShape(json.shape)
  }
};
ContainerNode.prototype.updateCanvasElements=function() {
  var content = this.graphicsContainer.content = [];
  var stroke = this.getEffectiveStroke();
  var thickness = this.getEffectiveStrokeThickness();
  var dashStyle = this.getEffectiveStrokeDashStyle();
  var brush = this.getEffectiveBrush();
  var params = {
    brush: brush,
    phase: EffectPhase.BeforeFill
  };
  this.applyEffects(content, params);
  if (params.brush) {
    brush = params.brush
  }
  this.graphicsContainer.rotationAngle = this.rotationAngle;
  this.graphicsContainer.pivot = this.bounds.center();
  var rect = this.bounds.clone();
  var frame = rect;
  if (this.shape == mdiag.SimpleShape.RoundedRectangle) {
    var mm = GraphicsUnit.getMillimeter(this.parent.measureUnit);
    var cornerRadius = mm * 2.5;
    frame = new Path();
    frame.addRoundRect(rect, cornerRadius)
  }
  var back = frame.clone();
  back.pen = null;
  back.brush = brush;
  back.shadow = this.createShadow();
  content.push(back);
  if (this.captionBackBrush) {
    var captionFill = rect.clone();
    captionFill.height = this.captionHeight;
    captionFill.brush = this.captionBackBrush;
    captionFill.pen = null;
    if (this.shape == mdiag.SimpleShape.RoundedRectangle) {
      var clipped = new MindFusion.Drawing.Container();
      clipped.clip = frame;
      clipped.content.push(captionFill);
      content.push(clipped)
    } else {
      content.push(captionFill)
    }
  }
  this.applyEffects(content, {
    phase: EffectPhase.AfterFill
  });
  if (this.captionHeight > 0 && this.captionHeight < rect.height) {
    var y = rect.y + this.captionHeight;
    var line = new Line(rect.x, y, rect.right(), y);
    line.setPen(stroke);
    line.strokeThickness = thickness;
    line.strokeDashStyle = dashStyle;
    if (this.shape == mdiag.SimpleShape.RoundedRectangle && (y < cornerRadius || y > rect.height - cornerRadius)) {
      line.clipPath = frame
    }
    content.push(line)
  }
  rect = rect.clone();
  rect.height = this.captionHeight;
/*  if (this.folder) {
    rect.width -= this.captionHeight
  }*/
//  rect = rect.inflate(-(4/4), (4/4));
  this.text.setBounds(rect, 0);
  this.text.font = this.getEffectiveFont();
  this.text.pen = this.getEffectiveTextColor();
  this.text.stroke = this.getEffectiveTextStroke();
  this.text.strokeThickness = this.getEffectiveTextStrokeThickness();
  this.text.ignoreTransform = this.rotationAngle != 0;
  content.push(this.text);
  frame.pen = stroke;
  frame.strokeThickness = thickness;
  frame.strokeDashStyle = dashStyle;
  frame.brush = null;
  content.push(frame);
  this.addManipulatorVisuals(content);
  if (this.onUpdateVisuals) {
    this.onUpdateVisuals(this)
  }
};

ContainerNode.prototype.resizeFitText = function (fit)
{
    if (this.text == undefined || this.text == "") {
      return false
    }
    if (fit == undefined) {
      fit = FitSize.KeepRatio;
    }
    var h=this.getCaptionHeight();
    var mm = GraphicsUnit.getMillimeter(this.parent.measureUnit);
    var rc = this.bounds.clone();
    var remainingHeight=rc.height-h;
    //rc.height=h;
    this.textPadding.applyTo(rc);
    var stepx = mdiag.Utils.getFitTextStep(this.parent.measureUnit);
    var stepy = stepx;
    var text = this.text.text;
    var font = this.getEffectiveFont();
    var styled = true;
    if (fit == FitSize.KeepRatio) {
      var hvratio = rc.width / h;
      var vhratio = h / rc.width;
      if (hvratio < vhratio) {
        vhratio = 1 / hvratio;
        hvratio = 1
      } else {
        hvratio = 1 / vhratio;
        vhratio = 1
      }
      stepx = hvratio * stepx;
      stepy = vhratio * stepy;
      var cx = 0;
      var cy = 0;
      var b = this.bounds.clone();
      b.height=h;
      rc.height=h;
      var size = this.parent.measureString(text, font, rc, styled);
      var minWidth = styled ? 20 * mm : Text.getMinWidth(text, font, this.parent.context, this.parent.scale);
      while (size.height > rc.height) {
          cx += stepx;
          cy += stepy;
          rc = this.bounds.clone();
          rc.height=h;
          rc = mdiag.Utils.inflate(rc, cx, cy);
          var size = this.parent.measureString(text, font, rc, styled);
          if (rc.width > mm * 1000) {
            break
          }
        }

      this.textPadding.addToRect(rc);
      this.setCaptionHeight(rc.height);
      rc.height=rc.height+remainingHeight;
      this.setBounds(rc, true)
    }
    this.invalidate();
    return true

};

$(document).ready(function ()
{


	document.getElementById('file').addEventListener('change', onChange);
	//  document.getElementById('moduleRx').addEventListener('change', onModuleRx);
	// create a Diagram component that wraps the "diagram" canvas
	diagram = AbstractionLayer.createControl(Diagram, null, null, null, $("#diagram")[0]);
	diagram.setAllowInplaceEdit(true);
	diagram.setRouteLinks(true);
	diagram.setAlignToGrid(true);
	diagram.setShowGrid(true);
	diagram.setUndoEnabled(true);
	diagram.setRoundedLinks(true);
	diagram.setBounds(new Rect(0, 0, 400, 400));
	diagram.setBehavior(MindFusion.Diagramming.Behavior.DrawLinks);


	//diagram.setSelectAfterCreate(false);



	var glassEffect = new GlassEffect();
	glassEffect.setType(GlassEffectType.Type3);

	//diagram.getNodeEffects().push(glassEffect);

	diagram.addEventListener(Events.nodeCreated, onNodeCreated);
	diagram.addEventListener(Events.linkCreating, onLinkCreating);
	diagram.addEventListener(Events.linkCreated, onLinkCreated);
	diagram.addEventListener(Events.linkTextEdited, onLinkTextEdited);
	diagram.addEventListener(Events.nodeTextEdited, onNodeTextEdited);

	diagram.addEventListener(Events.nodeSelected, onNodeSelected);
	diagram.addEventListener(Events.nodeDeselected, onNodeSelected);
	//create edit node text
	// diagram.addEventListener(Events.nodeDoubleClicked, createEditControl);
	diagram.addEventListener(Events.linkDoubleClicked, OnLinkDoubleClicked);
	diagram.addEventListener(Events.containerFolded, onContainerFolded);
	diagram.addEventListener(Events.containerUnfolded, oncontainerUnfolded);
	diagram.addEventListener(Events.nodeModifying, onNodeModifying);

	//diagram.addEventListener(Events.onEnterInplaceEditScript, onEnterInplaceEditScript);
	//diagram.addEventListener(Events.onTextEditing, onTextEditing);
	//diagram.addEventListener(Events.onTextEdited, onTextEdited);
	// create an Overview component that wraps the "overview" canvas
	overview = AbstractionLayer.createControl(Overview,
        null, null, null, $("#overview")[0]);
	overview.setDiagram(diagram);

	diagram.setModificationStart(MindFusion.Diagramming.ModificationStart.AutoHandles);

	// create an NodeListView component that wraps the "nodeList" canvas
	nodeList = AbstractionLayer.createControl(NodeListView, null, null, null, $('#nodeList')[0]);
	var shapes = ["Circle", "Rectangle", "Circle"]
	for (var i = 0; i < shapes.length; i++)
	{
		// skip some arrowhead shapes that aren't that useful as node shapes
		var shape = shapes[i];
		var text = '';
		var node = new MindFusion.Diagramming.ShapeNode(diagram);
		if (shape === 'Circle' && i == 0)
		{
			text = 'Start';
			node.setEnableStyledText(true);
			node.setBrush("lightGreen");
			node.setText('<b>Start</b>');
		}
		if (shape === 'Circle' && i != 0)
		{
			node.setEnableStyledText(true);
			node.setBrush("Red");
			text = 'End';
			node.setText('<b>End</b>');
		}
		if (shape === 'Decision')
		{
			text = 'Decision';
			//node.setText('Decision');
		}
		if (shape === 'Rectangle')
		{
			text = 'Task';
			//node.setText('Task');
		}
		if (shape === 'RoundRect')
		{
			text = 'Rx Module';
			//node.setText('Task');
		}
		node.setShape(shape);

		nodeList.addNode(node, text);
	}

	nodeList.addEventListener(Events.nodeSelected, onShapeSelected);
	$('[data-toggle="tab"]').on('click', function ()
	{
		var nav = $(this).attr('href');
		var itemId = nav.substring(1, nav.length);
		$('#' + itemId).siblings('.nav-pane').hide();
		$('#' + itemId).show();
		$(this).parent('li').addClass('active');
		$(this).parent('li').siblings().removeClass('active');
	})
	$('input.file').on('change', function ()
	{
		//App.TableDND.tasks.updateModelValues(jq(this).closest('tr'));
		var fileInput = this;
		if (fileInput.files[0])
		{
			if (fileInput.files[0].name.endsWith('exe'))
			{
				return false;
			}
			var name = fileInput.files[0].name;
			if (!diagram.activeItem.activeEditedContent.taskfile)
			{
				diagram.activeItem.activeEditedContent.taskfile = [];
			} else
			{
				diagram.activeItem.activeEditedContent.taskfile.push(name);
			}

			$('.selected-list').append('<li>' + name + '</li>');
		}

	});
	$('.upload').on('click', function ()
	{
		$('input.file').trigger('click');
	});


});

function onNodeTextEdited(sender,e){
  
  var selectedNode = e.getNode();
  if(selectedNode.folder){
	  
      diagram.activeItem.resizeFitText(FitSize.KeepRatio); 
	  diagram.activeItem.resizeToFitChildren();
  }
  else{
	  diagram.activeItem.PolygonalTextLayout = true;
  diagram.activeItem.resizeToFitText(FitSize.KeepRatio);  
  }

}
function onNodeModifying(sender,e){
  var selectedNode = e.getNode();
  if(selectedNode.folded)
      selectedNode.setCaptionHeight(selectedNode.getBounds().height);

}
function onShapeSelected(sender, e)
{
	var selectedNode = e.getNode();
	if (selectedNode)
		diagram.setDefaultShape(selectedNode.getShape());
}
function onContainerFolded(sender, e)
{
	var selectedNode = e.getNode();

	if (selectedNode)
	{
		var rect = selectedNode.bounds.clone();
		rect.height = selectedNode.getCaptionHeight();
		rect.width = selectedNode.unfoldedSize.width;
		selectedNode.setBounds(rect, true);
	}

	applyLayeredLayout();
}

function oncontainerUnfolded(sender, e)
{
	var selectedNode = e.getNode();
	if (selectedNode)
	{
		if (selectedNode.getCaptionHeight() === 20)
			selectedNode.setBounds(new Rect(selectedNode.getBounds().x, selectedNode.getBounds().y, selectedNode.getBounds().width, selectedNode.getBounds().height));
	} else
	{
		selectedNode.setBounds(new Rect(selectedNode.getBounds().x, selectedNode.getBounds().y, selectedNode.getBounds().width, selectedNode.getBounds().height + selectedNode.getCaptionHeight()));
	}
	selectedNode.resizeToFitChildren();

	applyLayeredLayout();
}


function OnLinkDoubleClicked(sender, e)
{
	var len=parseInt(diagram.activeItem.points.length/2);
	diagram.beginEdit(diagram.activeItem,diagram.activeItem.points[len-1]);
}

 function fitText(node)
{
	var nodeRect = node.getBounds();
	var nodeArea = nodeRect.width * 20;
	var font = node.getEffectiveFont();

	var paddingWidth = 2, paddingHeight = 2;
	var padding = node.getTextPadding();
	if (padding != null)
	{
		var paddingWidth = padding.left + padding.right;
		var paddingHeight = padding.top + padding.bottom;
	}

	var textSize = diagram.measureString(node.getText(),font,nodeArea,true);
	var textArea = textSize.width * (textSize.height + paddingHeight);
	if (textSize.width > nodeRect.width)
	{
		node.setCaptionHeight(textSize.width/16);
		node.setBounds(new Rect(nodeRect.x,nodeRect.y,textSize.width/4,nodeRect.height));

	}
}

function onNodeCreated(sender, args)
{
	var node = args.getNode();
  var bounds = node.getBounds();
var topLeft = node.parent.alignPointToGrid(bounds.topLeft());
var newBounds = new Rect(
    topLeft.x, topLeft.y, bounds.width, bounds.height);
node.setBounds(newBounds);
	//node.setBrush('#E8F6F3'); // Reset brush
  var apat = new AnchorPattern([
  new AnchorPoint(50, 0, true, true),
  new AnchorPoint(100, 50, true, true),
  new AnchorPoint(50, 100, true, true),
  new AnchorPoint(0, 50, true, true)]);
node.setAnchorPattern(apat);
	node.setHandlesStyle(HandlesStyle.HatchHandles3);
	node.setFont(null);

  if(node.getShape().id==='RoundRect'){
    diagram.removeItem(node);
    loadJson(node.getBounds().x,node.getBounds().y);
  }
}

function onLinkCreating(sender, args)
{
 var link = args.getLink();
 link.setHeadShape("Triangle");
 link.setHeadShapeSize(4);
 link.setHeadBrush('black');
 link.setStroke(1.5);
   link.setStroke('black');
   //link.setTextStyle(MindFusion.Diagramming.LinkTextStyle.Follow);
 if (!link.targetConnection)
  return;

 var origin = link.originConnection.anchorPointDetails.point;
 var target = link.targetConnection.anchorPointDetails.point;
 if (Math.abs(origin.x - target.x) < 4 || Math.abs(origin.y - target.y) < 4)
  link.setStroke("blue");
}

function onLinkCreated(sender, args)
{
 var link = args.getLink();

 link.setStroke("black");

 if (!link.targetConnection)
  return;

 var update = false;

 var origin = link.originConnection.anchorPointDetails.point;
 var target = link.targetConnection.anchorPointDetails.point;

 if (Math.abs(origin.x - target.x) < 4)
 {
  link.setShape(MindFusion.Diagramming.LinkShape.Polyline);
  link.points[link.points.length - 1].x = origin.x;
  update = true;
 }
 if (Math.abs(origin.y - target.y) < 4)
 {
  link.setShape(MindFusion.Diagramming.LinkShape.Polyline);
  link.points[link.points.length - 1].y = origin.y;
  update = true;
 }
 link.setShape(MindFusion.Diagramming.LinkShape.Cascading);
 if (update)
 {
  link.updateFromPoints();
  link.route();
 }
}

function onLinkTextEdited(sender, args)
{
  var link = args.getLink();

}

function onNodeSelected(sender, args)
{
	var node;
	if (diagram.getSelection().nodes.length > 0)
		node = diagram.getSelection().nodes[0];

	if (node && node.getStyle() !== undefined)
	{
		var style = node.getStyle();
		if (style.getFontName())
			$('#fontName').val(style.getFontName());
		else
			$('#fontName').val('Verdana');
		if (style.getFontSize())
			$('#fontSize').val(style.getFontSize());
		else
			$('#fontSize').val('3');
		$("#fontName").selectmenu("refresh");
		$("#fontSize").selectmenu("refresh");
	}
	else
	{
		$('#fontName').val('Verdana');
		$('#fontSize').val('3');
		$("#fontName").selectmenu("refresh");
		$("#fontSize").selectmenu("refresh");
	}
}

function onUndo()
{
	diagram.undo();
}

function onRedo()
{
	diagram.redo();
}

function onDelete()
{
	diagram.startCompositeOperation();
	for (var i = diagram.getSelection().items.length - 1; i >= 0; i--)
	{
		diagram.removeItem(diagram.getSelection().items[i]);
	}
	diagram.commitCompositeOperation();
}

function onZoomIn()
{
	diagram.setZoomFactor(Math.min(800, diagram.getZoomFactor() + 10));
}

function onZoomOut()
{
	diagram.setZoomFactor(Math.max(10, diagram.getZoomFactor() - 10));
}

function onResetZoom()
{
	diagram.setZoomFactor(100);
}

$('#fontName').on("selectmenuchange", function ()
{
	diagram.startCompositeOperation();
	for (var i = 0; i < diagram.getSelection().items.length; i++)
	{
		var item = diagram.getSelection().items[i];
		var change = new ChangeItemCommand(diagram, item);

		var style = item.getStyle();
		if (!style)
		{
			style = new Style();
			item.setStyle(style);
		}

		style.setFontName(this.value);
		item.invalidate();

		diagram.executeCommand(change);
	}
	diagram.commitCompositeOperation();
});

$('#fontSize').on("selectmenuchange", function ()
{
	diagram.startCompositeOperation();
	for (var i = 0; i < diagram.getSelection().items.length; i++)
	{
		var item = diagram.getSelection().items[i];
		var change = new ChangeItemCommand(diagram, item);

		var style = item.getStyle();
		if (!style)
		{
			style = new Style();
			item.setStyle(style);
		}

		style.setFontSize(this.value);
		item.invalidate();

		diagram.executeCommand(change);
	}
	diagram.commitCompositeOperation();
});
$('.toggle-close').on('click',function(){

	$('.inspector').hide();
});





function onBold()
{
	diagram.startCompositeOperation();
	for (var i = 0; i < diagram.getSelection().items.length; i++)
	{
		var item = diagram.getSelection().items[i];
		var change = new ChangeItemCommand(diagram, item);

		var style = item.getStyle();
		if (!style)
		{
			style = new Style();
			item.setStyle(style);
		}

		if (style.getFontStyle() === undefined)
		{
			style.setFontStyle(FontStyle.Bold);
		}
		else if ((style.getFontStyle() & FontStyle.Bold) != FontStyle.Bold)
		{
			style.setFontStyle(style.getFontStyle() | FontStyle.Bold);
		}
		else
		{
			style.setFontStyle(style.getFontStyle() & ~FontStyle.Bold);
		}

		item.invalidate();

		diagram.executeCommand(change);
	}
	diagram.commitCompositeOperation();
}

function onItalic()
{
	diagram.startCompositeOperation();
	for (var i = 0; i < diagram.getSelection().items.length; i++)
	{
		var item = diagram.getSelection().items[i];
		var change = new ChangeItemCommand(diagram, item);

		var style = item.getStyle();
		if (!style)
		{
			style = new Style();
			item.setStyle(style);
		}

		if (style.getFontStyle() === undefined)
		{
			style.setFontStyle(FontStyle.Italic);
		}
		else if ((style.getFontStyle() & FontStyle.Italic) != FontStyle.Italic)
		{
			style.setFontStyle(style.getFontStyle() | FontStyle.Italic);
		}
		else
		{
			style.setFontStyle(style.getFontStyle() & ~FontStyle.Italic);
		}

		item.invalidate();

		diagram.executeCommand(change);
	}
	diagram.commitCompositeOperation();
}

function onUnderlined()
{
	diagram.startCompositeOperation();
	for (var i = 0; i < diagram.getSelection().items.length; i++)
	{
		var item = diagram.getSelection().items[i];
		var change = new ChangeItemCommand(diagram, item);

		var style = item.getStyle();
		if (!style)
		{
			style = new Style();
			item.setStyle(style);
		}

		if (style.getFontStyle() === undefined)
		{
			style.setFontStyle(FontStyle.Underline);
		}
		else if ((style.getFontStyle() & FontStyle.Underline) != FontStyle.Underline)
		{
			style.setFontStyle(style.getFontStyle() | FontStyle.Underline);
		}
		else
		{
			style.setFontStyle(style.getFontStyle() & ~FontStyle.Underline);
		}

		item.invalidate();

		diagram.executeCommand(change);
	}
	diagram.commitCompositeOperation();
}

function onLeft()
{
	diagram.startCompositeOperation();
	for (var i = 0; i < diagram.getSelection().items.length; i++)
	{
		var item = diagram.getSelection().items[i];
		var change = new ChangeItemCommand(diagram, item);
		item.setTextAlignment(Alignment.Near);
		diagram.executeCommand(change);
	}
	diagram.commitCompositeOperation();
}

function onCenter()
{
	diagram.startCompositeOperation();
	for (var i = 0; i < diagram.getSelection().items.length; i++)
	{
		var item = diagram.getSelection().items[i];
		var change = new ChangeItemCommand(diagram, item);
		item.setTextAlignment(Alignment.Center);
		diagram.executeCommand(change);
	}
	diagram.commitCompositeOperation();
}

function onRight()
{
	diagram.startCompositeOperation();
	for (var i = 0; i < diagram.getSelection().items.length; i++)
	{
		var item = diagram.getSelection().items[i];
		var change = new ChangeItemCommand(diagram, item);
		item.setTextAlignment(Alignment.Far);
		diagram.executeCommand(change);
	}
	diagram.commitCompositeOperation();
}

function onTop()
{
	diagram.startCompositeOperation();
	for (var i = 0; i < diagram.getSelection().items.length; i++)
	{
		var item = diagram.getSelection().items[i];
		var change = new ChangeItemCommand(diagram, item);
		item.setLineAlignment(Alignment.Near);
		diagram.executeCommand(change);
	}
	diagram.commitCompositeOperation();
}

function onMiddle()
{
	diagram.startCompositeOperation();
	for (var i = 0; i < diagram.getSelection().items.length; i++)
	{
		var item = diagram.getSelection().items[i];
		var change = new ChangeItemCommand(diagram, item);
		item.setLineAlignment(Alignment.Center);
		diagram.executeCommand(change);
	}
	diagram.commitCompositeOperation();
}

function onBottom()
{
	diagram.startCompositeOperation();
	for (var i = 0; i < diagram.getSelection().items.length; i++)
	{
		var item = diagram.getSelection().items[i];
		var change = new ChangeItemCommand(diagram, item);
		item.setLineAlignment(Alignment.Far);
		diagram.executeCommand(change);
	}
	diagram.commitCompositeOperation();
}

function onLinkShapes()
{
	diagram.setBehavior(Behavior.LinkShapes);
}

function onLinkTables()
{
	diagram.setBehavior(Behavior.LinkTables);
}

function onModify()
{
	diagram.setBehavior(Behavior.Modify);
}

function onSaveClick()
{
	if (!localStorage)
		return;
	var name = $('#tbFileName')[0].value;
	if (localStorage.getItem(name))
		localStorage.removeItem(name);

	localStorage.setItem(name, diagram.toJson());

	if (listFileNames.find("option:contains('" + name + "')").length == 0)
	{
		var opt = document.createElement('option');
		opt.value = listFileNames[0].options.length;
		opt.innerHTML = name;
		listFileNames[0].appendChild(opt);
		listFileNames.selectmenu("refresh", true);
	}
}

function onLoadClick()
{
	if (!localStorage)
		return;
	var name = $('#listFileNames').find(":selected").text()
	var json = localStorage.getItem(name);
	if (json)
	{
		diagram.fromJson(json);
	}
}


function print()
{

	 //var img = new Image();
	 //img.style.display = 'block';
	 //img.style.width=1300+"px";
	// img.style.height="auto";
	// diagram.setShowGrid(false);
	// img.src=document.getElementById('diagram').toDataURL('image/png', 1.0);
	// diagram.setShowGrid(true);
	// var url=img.getAttribute('src');
	 var WinPrint = window.open('', '', 'left=0,top=0,toolbar=0,scrollbars=0,status=0');
	// var width=WinPrint.innerWidth-50;
	// img.style.width=width+"px";
	 //img.style.marginTop=20+"px";
	 //img.style.marginRight="auto";
	// img.style.marginLeft="auto"
	// WinPrint.document.write(img.outerHTML);
	// WinPrint.focus();
	// WinPrint.print();
	// WinPrint.location.reload();
	 //var canvas=document.getElementById('diagram');
	 WinPrint.document.write('<html><head><style type="text/css">');
	 WinPrint.document.write('@media print{.header{position:fixed;width:100%;top:0px;border-bottom:1px solid black} .header h2{text-align:left;}.footer{position:fixed;width:100%;bottom:0px;border-top:1px solid black} img{margin-top:60px;margin-bottom:60px}}');
	 //WinPrint.document.write('</style>');
	 //WinPrint.document.write('<style type="text/css">');
	 WinPrint.document.write(' @page {margin-top:60px;}');
	 WinPrint.document.write('</style></head><body>');
	 WinPrint.document.write('<div class="header"><h2>Test Next gen Rx Print </h2></div>');
	 var webglImage = (function convertCanvasToImage(canvas) {
		    var img = new Image();
		    img.style.height="auto";
		    var width=WinPrint.innerWidth-50;
			img.style.width=width+"px";
			//img.style.marginTop=20+"px";
			img.style.marginRight="auto";
			img.style.marginLeft="auto"
		    diagram.setShowGrid(false);
			img.src = canvas.toDataURL('image/png');
		    diagram.setShowGrid(true);
		    return img;
		  })(document.getElementById('diagram'));
	 WinPrint.document.body.appendChild(webglImage);
	// WinPrint.document.write('<div class="footer">footer</div></body></html>');
	 WinPrint.focus();
	 setTimeout(function() {
		 WinPrint.print();}, 100);
	 //WinPrint.location.reload();

}


function applyLayeredLayout()
{
	var layout = new MindFusion.Graphs.LayeredLayout();
	layout.direction = MindFusion.Graphs.LayoutDirection.TopToBottom;
	layout.nodeDistance  = 40;
	diagram.arrange(layout);

	for (var l = 0; l < diagram.links.length; l++)
	{
		var link = diagram.links[l];
		link.setShape(MindFusion.Diagramming.LinkShape.Cascading);
	}
	diagram.routeAllLinks();
}

function group()
{
	var container;
	    if(diagram.getSelection().nodes.length>0){
			container= diagram.getFactory().createContainerNode(diagram.getSelection().nodes[0].getBounds().x, diagram.getSelection().nodes[0].getBounds().y,80,80);
		}else{
			container= diagram.getFactory().createContainerNode(50,50,80,80);
		}

		for (var i = 0; i < diagram.getSelection().nodes.length; i++){
			if(!diagram.getSelection().nodes[i].container){
			container.add(diagram.getSelection().nodes[i]);
			}
		}
		container.arrange(new MindFusion.Graphs.LayeredLayout());
		container.setFoldable(true);
		container.setZIndex(0);
		container.setExpanded(false);
		container.setBrush('lightgrey');
		container.setEnableStyledText(true);
		container.setCaptionHeight(20);
		container.setFoldIconSize(7);
		container.resizeToFitChildren();
		var apat = new AnchorPattern([
  new AnchorPoint(50, 0, true, true),
  new AnchorPoint(100, 50, true, true),
  new AnchorPoint(50, 100, true, true),
  new AnchorPoint(0, 50, true, true)]);
container.setAnchorPattern(apat);
		applyLayeredLayout();
		container.setHandlesStyle(HandlesStyle.HatchHandles3);
		container.setHandlesStyle(HandlesStyle.DashFrame);
}


function download() {
	/*var uriContent = "data:application/octet-stream," + encodeURIComponent(diagram.toJson());
	window.open(uriContent, 'Example1.json');*/
	var name = $('#tbFileName')[0].value;
    var pom = document.createElement('a');
	data.diagram=diagram.toJson();
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
    pom.setAttribute('download', name+".json");

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event){
        console.log(JSON.parse(event.target.result).diagram);
		var editData=JSON.parse(event.target.result),
        obj = editData.diagram;
		data['diagramdetail']=editData.diagramdetail;
        diagram.fromJson(obj);
    }

	function Collapse(){

		for (var i = 0; i < diagram.nodes.length; i++){
			var CurrentNode=diagram.nodes[i];
		if(CurrentNode.folder){
			CurrentNode.setFolded(true);
		}
		}

	}

	function Expand(){



		for (var i = 0; i < diagram.nodes.length; i++){
			var CurrentNode=diagram.nodes[i];
		if(CurrentNode.folder){
			CurrentNode.setFolded(false);
		}
		}

	}
  function onModuleRx(event) {
          var reader = new FileReader();
          reader.onload = onReaderModuleRx;
          reader.readAsText(event.target.files[0]);
      }

      function onReaderModuleRx(event){
  		var editData=JSON.parse(event.target.result),
          obj = editData.diagram;
  		data['diagramdetail']=editData.diagramdetail;
          buildDiagram(JSON.parse(obj));
      }

    function buildDiagram(graph,x,y)
{
	// load activity data and create

var diagramNodes=[];
var containerNodes={};
var moduleContainer=diagram.getFactory().createContainerNode(x,y,80,80);
ArrayList.forEach(graph.items, function (activity)
	{

		if(activity.__type==='MindFusion.Diagramming.ShapeNode'){
		var diagramNode = diagram.getFactory().createShapeNode(activity.bounds.x,activity.bounds.y,activity.bounds.width,activity.bounds.height);
		diagramNode.setEnableStyledText(true)
		diagramNode.setShape(activity.shape);
		diagramNode.setBrush(activity.brush);
		diagramNode.setText(activity.text);
		diagramNodes.push(diagramNode);
		if(activity.container){
		if(!containerNodes[activity.container]){
			var containerNodeArr=[];
			containerNodeArr.push(diagramNode);
			containerNodes[activity.container]=containerNodeArr;
		}else{
			var containerNodeArr=containerNodes[activity.container];
			containerNodeArr.push(diagramNode);
			containerNodes[activity.container]=containerNodeArr;
		}
		}else{
			moduleContainer.add(diagramNode);
		}
		}else if(activity.__type==='MindFusion.Diagramming.ContainerNode')
		{
	      var container;
	      var particularContainerNodes=containerNodes[activity.instanceId];
			container= diagram.getFactory().createContainerNode(particularContainerNodes[0].bounds.x, particularContainerNodes[0].bounds.y,80,80);
		for (var i = 0; i < particularContainerNodes.length; i++)
			container.add(particularContainerNodes[i]);
		container.arrange(new MindFusion.Graphs.LayeredLayout());
		container.setFoldable(false);
		container.setZIndex(0);
		container.setExpanded(false);
		container.setFolded(false);
    container.setBrush('lightgrey');
		container.setEnableStyledText(true);
		container.setCaptionHeight(20);
		container.setFoldIconSize(7);
		container.resizeToFitChildren();
		diagramNodes.push(container);
		moduleContainer.add(container);
		}




	});




	ArrayList.forEach(graph.items, function (activity)
	{



		if(activity.__type==='MindFusion.Diagramming.DiagramLink'){
		diagram.getFactory().createDiagramLink(diagramNodes[activity.origin], diagramNodes[activity.destination]);
		}



	});

		moduleContainer.arrange(new MindFusion.Graphs.LayeredLayout());
		moduleContainer.setFoldable(true);
		moduleContainer.setZIndex(0);
		moduleContainer.setExpanded(false);
	  moduleContainer.setBrush('lightgrey');
		moduleContainer.setEnableStyledText(true);
		moduleContainer.setCaptionHeight(20);
		moduleContainer.setFoldIconSize(7);
		moduleContainer.resizeToFitChildren();


}

function addActivities(parentNode, parent)
{
	ArrayList.forEach(parent.activities, function (activity)
	{
		var diagramNode = diagram.getFactory().createShapeNode(bounds);
		diagramNode.setShape(activity.shape);
		diagramNode.setBrush(activity.brush);
		diagramNode.setText(activity.text);
		diagram.getFactory().createDiagramLink(parentNode, diagramNode);

		if (activity.activities)
			addActivities(diagramNode, activity);
	});
}



