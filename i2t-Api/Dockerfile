# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything
COPY . .

# Restore and publish
RUN dotnet restore i2t-Api/i2t-Api.csproj
RUN dotnet publish i2t-Api/i2t-Api.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install Tesseract & Leptonica
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    && rm -rf /var/lib/apt/lists/*

# Create symlink so Tesseract.NET finds the expected lib name
RUN ln -s /usr/lib/x86_64-linux-gnu/liblept.so.5 /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so

# Copy published app from build stage
COPY --from=build /app/publish .

# Copy tessdata (make sure it exists in your repo)
COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
